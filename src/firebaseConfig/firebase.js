// configuracion de firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
// json con parametros de firebase
const firebaseConfig = {
  apiKey: "AIzaSyBaxweI7UxavRVxg8YCA9bT1Y3r3FXOZAI",
  authDomain: "storagestore-8eb19.firebaseapp.com",
  projectId: "storagestore-8eb19",
  storageBucket: "storagestore-8eb19.appspot.com",
  messagingSenderId: "981213602965",
  appId: "1:981213602965:web:91c4f5898a1f29d148279c"
};

// pasamos el json como parametro
const app = initializeApp(firebaseConfig);
// nos conectamos a la base de datos y ya la podemos usar importandola en un componente
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
// Para Seleccionar la url de la imagen y asi poder subirla
/* file es el archivo en si, storage es el storage que 
obtenemos de getStorage, ref es para decirle que utilize
ese storage
uploadBytes: sirve para subir el archivo, hay muchas 
formas de subirlo. nosotros usamos el blob of file en el
que vos solo seleccionas el archivo y firebase lo sube.
tmb lo podes subir en formato de bites o en base64 y row
string  pero con todo esto solo lo seleccionamos no se
sube todavia. el 2do parametro es el id de las img pero
OJO si es estatico cada imagen nueva borra la anterior
xq el id solo puede ser unico y para que eso pase
firebase elimina la anterior, para q esto no pase usamos:
UUID para generar ids dinamicos automaticamente
por cada foto y asi si se suben mas fotos no se vallan eliminando
y cambiando siempre x la mas actual, sino que se 
guarden todas. y then es la promesa. el v4 sirve para
generar ese id nuevo x cada img. */
export function uploadFile(file) {
  const storageRef = ref(storage, v4());
  uploadBytes(storageRef, file).then((snapshot) => {
    console.log('url de la img', snapshot);
  });
}

// para almacenar datos en firebase, usa un producto llamado firestore
//* *1) usa el Metodo getFirestore  */
