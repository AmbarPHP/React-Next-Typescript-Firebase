import { useState } from 'react';
import {
  Grid, Typography, Button, Modal, Box, TextField, MenuItem,
  InputLabel,
  Select
} from '@mui/material';
import swal from 'sweetalert';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';

const style = {
  width: '80%',
  height: 'auto',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 700,
  backgroundColor: 'white',
  padding: 4,
};

const AddUsers = () => {
  // campos firebase
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [grade, setGrade] = useState('');
  const [group, setGroup] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('true');

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const userscollection = collection(db, 'users');

  const addUsers = (e) => {
    e.preventDefault();
    addDoc(userscollection, { name, group, grade, phone, details, status })
      .then(swal('Good job!', 'Users has been added !', 'success'))
      .catch((err) => swal(err.message));
    setOpen(false);
  };
  return (
    <>
      <Grid
        style={{
          height: '20vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      />
      <Button onClick={handleOpen} variant="contained">
        Add
      </Button>
      <Modal
        style={{ padding: '40px' }}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
            item
          >
            <Button variant="contained" onClick={handleClose}>
              X
            </Button>
          </Grid>
          <Typography style={{ textAlign: 'center', color: '#aaa' }} id="modal-modal-title" variant="h3" component="h2">
            Agregar usuario
          </Typography>
          <form
            onSubmit={addUsers}
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextField
              style={{ width: '80%', margin: '15px', backgroundColor: '#fff' }}
              id="outlined-basic"
              label="Nombre"
              variant="outlined"
              required
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              type="text"
              style={{ width: '80%', margin: '15px', backgroundColor: '#fff' }}
              id="outlined-basic"
              label="Detalles"
              variant="outlined"
              required
              onChange={(e) => setDetails(e.target.value)}
            />
            <InputLabel id="demo-simple-select-label">Grado</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={grade}
              label="Grado"
              style={{ width: '80%', margin: '0.9375rem', backgroundColor: '#fff' }}
              onChange={(e) => setGrade(e.target.value)}
            >

              <MenuItem value={1}>Primero</MenuItem>
              <MenuItem value={2}>Segundo</MenuItem>
              <MenuItem value={3}>Tercero</MenuItem>
              <MenuItem value={4}>Cuarto</MenuItem>
              <MenuItem value={5}>Quinto</MenuItem>
              <MenuItem value={6}>Sexto</MenuItem>
            </Select>
            <InputLabel id="demo-simple-select-label">Grupo</InputLabel>
            <Select
              labelId="demo-simple-select-group"
              id="demo-simple-select-group"
              value={group}
              label="Grupo"
              style={{ width: '80%', margin: '0.9375rem', backgroundColor: '#fff' }}
              onChange={(e) => setGroup(e.target.value)}
            >

              <MenuItem value={"A"}>A</MenuItem>
              <MenuItem value={"B"}>B</MenuItem>
              <MenuItem value={"C"}>C</MenuItem>
            </Select>
            <TextField
              type="text"
              style={{ width: '80%', margin: '15px', backgroundColor: '#fff' }}
              id="outlined-basic"
              label="Phone"
              variant="outlined"
              required
              onChange={(e) => setPhone(e.target.value)}
            />


            <input
              style={{
                margin: '10px',
                padding: '15px',
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                width: '40%',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
              type="submit"
              value="Add"
            />
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default AddUsers;
