
import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Alert, AlertTitle } from '@material-ui/lab';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import firebase from "firebase";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


export default function HomePage() {

    const [screen, setScreen] = useState(false);
    const [alert, setAlert] = useState(false);
    const [todo, setTodo] = useState({ title: "", task: "" });
    const [todoDate, onChange] = useState(new Date());
    const [isSaving, setIsSaving] = useState(false);
    const [fetchResult, setfetchResult] = useState();
    const [loading, isLoading] = useState(true);
    const [dialog, setDialog] = useState(false);
    const [selectedDoc, setSelectedDOc] = useState()
    const [deleting, isDeleting] = useState(false)
    const [empty, isEmpty] = useState(false)


    useEffect(() => {
        getTodo().then(function (data) {
            setfetchResult(data);

            isLoading(false)
        });

    }, [isSaving, deleting]);

    const getTodo = async () => {
        const firestore = firebase.firestore();
        const snapshot = await firestore.collection('todo-app').get();
        snapshot.empty ? isEmpty(true) : isEmpty(false);

        return snapshot.docs.map(doc => doc);

    }

    function handleChange(event) {
        todo[event.target.id] = event.target.value;
        setTodo({ ...todo, todo });

    }



    const handleSave = () => {

        setIsSaving(true);
        setAlert(true);
        const firestore = firebase.firestore();
        firestore.collection("todo-app").add({
            TodoDate: todoDate,
            title: todo.title,
            task: todo.task
        }).then(function (response) {
            setTodo({ title: "", task: "" });
            onChange(new Date());
            setAlert(false);
            setIsSaving(false);
        }).catch(function (error) {
            setAlert(false);
            setIsSaving(false);
        })
    };

    const onDeleteItem = () => {
        isDeleting(true);
        const firestore = firebase.firestore();

        firestore.collection("todo-app").doc(selectedDoc).delete()
            .then(function () {
                isDeleting(false);
                console.log("Successfull Deleted");
            }).catch(function (error) {
                isDeleting(false);
            })
        setDialog(false);

    };

    const dialogClose = () => {

        setDialog(false);
    };

    const onSelectDocForDelete = (id) => {

        setSelectedDOc(id);
        setDialog(true);
    }

    const screenCreate = () => {
        setScreen(false);
    }
    const screenList = () => {
        setScreen(true);
    }

    return (
        <div style={{
            backgroundImage: "url( https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg) ",
            height: '100vh',
            boxShadow: '10px 10px 8px 10px #888888',
            /* Center and scale the image nicely */
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        }}>
            <div>
                <AppBar position="static">
                    <Toolbar>

                        <Typography variant="h6">
                            ToDo Application
    </Typography>
                        <Button color="inherit" onClick={() => screenCreate()}>Create</Button>
                        <Button color="inherit" onClick={() => screenList()}>View</Button>
                    </Toolbar>
                </AppBar>

            </div>

            {screen ?
                <div>

                    {loading ? <div>Loading...</div> :
                        empty ? <div>List is Empty <br />Add Some Todo First</div> :
                            <List>
                                {fetchResult.map((item) =>
                                    <ListItem style={{ backgroundColor: '#81c784', padding: '15', marginBottom: 5 }}>

                                        <ListItemText>
                                            <label>{item.data().TodoDate.toDate().toDateString()}</label><br />
                                            <b>{item.data().title} </b><br />
                                            <label>{item.data().task}</label>


                                        </ListItemText>
                                        <ListItemSecondaryAction>

                                            <IconButton edge='end' aria-label='delete' >
                                                <DeleteIcon onClick={() => onSelectDocForDelete(item.id)} />
                                            </IconButton>

                                        </ListItemSecondaryAction>
                                    </ListItem>

                                )}
                            </List>}


                </div>
                :
                <div style={{

                    width: '50vw',
                    display: 'Block',
                    backgroundColor: 'rgba(102, 187, 106,0.9)',
                    marginTop: 20,
                    marginLeft: '25vw',
                    padding: 20
                }}>

                    <b style={{ fontSize: 20, }}><label>Create Todo</label></b>

                    <center style={{ paddingTop: 10 }}>
                        <Calendar
                            Co
                            onChange={onChange}
                            value={todoDate}

                        />
                    </center>
                    <TextField
                        style={{ width: '36vw', padding: 35, paddingBottom: 1, paddingTop: 10 }}
                        id="title"
                        placeholder="Title"

                        multiline
                        rows={1}

                        onChange={handleChange}

                        value={todo.title}

                        variant="filled"
                        disabled={isSaving}
                    />

                    <TextField
                        style={{ width: '36vw', padding: 35, paddingTop: 10 }}
                        id="task"
                        placeholder="Enter Your Task"
                        multiline
                        rows={3}
                        onChange={handleChange}
                        color="Secondary"
                        value={todo.task}
                        variant="filled"
                        disabled={isSaving}
                    />
                    {
                        <Button onClick={handleSave} disabled={isSaving} variant="contained" color="primary" style={{ float: 'right', marginRight: 20, marginTop: -20 }}>
                            Save
                        </Button>
                    }
                    <Collapse in={alert}>
                        <Alert severity="success">
                            <AlertTitle>Success</AlertTitle>
  Todo Successfully Created
</Alert>
                    </Collapse>

                </div>
            }
            <Dialog
                open={dialog}
                onClose={dialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Do you want to delete this Todo?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You cannot Undo this action.
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={dialogClose} color="primary">
                        Disagree
          </Button>
                    <Button onClick={onDeleteItem} color="primary" autoFocus>
                        Agree
          </Button>
                </DialogActions>
            </Dialog>




        </div>
    )
}



