/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Typography,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  RadioGroup,
  FormControlLabel, Radio,
  Modal,
  Box,
  TablePagination,
  Checkbox,
} from '@mui/material';
import swal from 'sweetalert';
import { collection, doc, getDoc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';
import { UserListToolbar } from '../sections/@dashboard/user';
import AddUsers from '../layouts/dashboard/AddUsers';
import { db } from '../firebaseConfig/firebase';
import Label from '../components/Label';

const modalSweet = {
  width: '80%',
  height: 'auto',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 700,
  backgroundColor: 'black',
  padding: 4,
};
const User = () => {
  // datos firebase
  const [data, setData] = useState([]);
  // campos firebase
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [group, setGroup] = useState('');
  const [details, setDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  const [id, setId] = useState('');

  // abrir y cerrar botones
  const [open, setOpen] = useState(false);
  // Cambiar la pagina de la tabla.
  const [page, setPage] = useState(0);

  // Numero de resultados minimos por pagina
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // cerrar la x del modal sweat
  const close = () => {
    setOpen(false);
  };
  // conectamos con la coleccion
  const userscollection = collection(db, 'users');

  // Boton eliminar funcionalidad con swal
  const deleteButton = (id) => {
    swal({
      title: 'Are you sure?',
      text: 'want to delete this data row permanently?',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((Delete) => {
      if (Delete) {
        swal('Your data row has been deleted.', {
          icon: 'success',
        });
        // si se clickea en OK  eliminamos el documento, x cada documento hay una fila. asi que eliminariamos la fila tmb
        const docRef = doc(userscollection, id);
        deleteDoc(docRef);
      } else {
        swal('Your data row is safe!');
      }
    });
  };
  // Mostrar los datos en tiempo real, y usamos value que va a tener esta caracteristica.
  useEffect(() => {
    const snap = onSnapshot(userscollection, (snapshot) => {
      setData(
        snapshot.docs.map((value) => ({
          id: value.id,
          value: value.data(),
        }))
      );
    });
    return () => {
      console.log(snap);
      snap();
    };

  }, []);

  // Boton editar
  const editButton = async (id) => {
    console.log("muestrame el id", id);
    setOpen(true);
    setId(id);
    const docRef = doc(db, "users", id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {

        const data = docSnap.data()
        console.log("descargar datos:", data);
        setName(data.name);
        setGrade(data.grade);
        setGroup(data.group);
        setPhone(data.phone);
        setDetails(data.details);
        setStatus(data.status);


      }
      else { console.log("Document does not exist") }
    } catch (error) { console.log(error) }

  };

  // actualizar data de firebase en los forms.del swal
  const updateData = (id) => {
    const editRef = doc(db, 'users', id);
    updateDoc(editRef, { name, group, grade, details, phone, status });
    setOpen(false);
    swal('Your data row file has been Updated!', {
      icon: 'success',
    });
  };
  // cambiar de pagina
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  // Para cambiar las columnas segun que boton usemos.
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  return (
    <>
      <UserListToolbar />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell >Agregar usuario</TableCell>
              <TableCell align="center">
                <AddUsers />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">
                <Checkbox />
              </TableCell>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Grupo</TableCell>
              <TableCell align="center">Details</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">Estatus</TableCell>
              <TableCell align="center">Editar</TableCell>
              <TableCell align="center">Borrar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((value) => (

              <TableRow key={value.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center">
                  <Checkbox />
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  {value.value.name}
                </TableCell>
                <TableCell align="center"> {value.value.grade}-{value.value.group} </TableCell>
                <TableCell align="center"> {value.value.details} </TableCell>
                <TableCell align="center"> {value.value.phone} </TableCell>
                <TableCell align="center">
                  <Label // Este Label sirve para poner un ghost que tenga color rojo si dice Banned y sino color verde. lo usamos como valor el label. (siguen saliendo de la base de datos los valores Banned y Active.)
                    sx={{ minWidth: 50 }}
                    variant="ghost"
                    color={(value.value.status === "false" ? 'error' : 'success')}
                  >
                    {value.value.status === "true" ? 'activo' : 'desactivado'}
                  </Label>
                </TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => {
                      editButton(value.id);
                    }}
                    variant="contained"
                  >
                    Editar
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => {
                      deleteButton(value.id);
                    }}
                    variant="contained"
                    color="error"
                  >
                    Borrar
                  </Button>
                </TableCell>
              </TableRow> /* count={value.value.length} */
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]} /* Opciones de cuantas filas queremos mostrar */
          component="div"
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Modal // Modal edit mui con sweet alert

        style={{ padding: '1.5rem' }}
        open={open}
        onClose={close}
      >
        <div >
          <Box sx={modalSweet} style={{ backgroundColor: "#fff" }}>
            <Grid

              style={{
                display: 'flex',
                justifyContent: 'flex-end  ',

              }}

            >
              <Button variant="contained" onClick={close}>
                X
              </Button>
            </Grid>
            <Typography style={{ textAlign: 'center', color: '#aac' }} variant="h3" component="h2">
              Editar Usuarios
            </Typography>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateData(id);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff'
              }}
            >
              <input type="text" value={id} readOnly hidden />
              <TextField
                style={{ width: '80%', margin: '0.9375rem', backgroundColor: '#fff' }}
                label="Nombre"
                variant="outlined"
                required
                value={name}

                onChange={(e) => setName(e.target.value)}
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

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
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
                style={{ width: '80%', margin: '0.9375rem', backgroundColor: '#fff' }}
                label="Detalles"
                variant="outlined"
                value={details}
                required
                onChange={(e) => setDetails(e.target.value)}
              />
              <TextField
                type="text"
                style={{ width: '80%', margin: '0.9375rem', backgroundColor: '#fff' }}
                label="Telefono"
                variant="outlined"
                value={phone}
                required
                onChange={(e) => setPhone(e.target.value)}
              />
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
              >

                <FormControlLabel value="true" onChange={(e) => setStatus(e.target.value)} checked={status === "true"} control={<Radio />} label="Activo" />

                <FormControlLabel value="false" onChange={(e) => setStatus(e.target.value)} checked={status === "false"} control={<Radio />} label="Desactivo" />

              </RadioGroup>
              <input
                style={{
                  margin: '0.625rem',
                  padding: '0.9375rem',
                  background: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  width: '40%',
                  borderRadius: '0rem',
                  cursor: 'pointer',
                }}
                type="submit"
                value="Edit"
              />
            </form>
          </Box>
        </div>

      </Modal>
    </>
  );

};
export default User;
