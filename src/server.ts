import boot from './app';


const PORT = 5000
const app = boot();

app.listen(PORT,  () => {
  console.log(`server started on localhost ${PORT}.`)
})