import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import Toast, { POSITION } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const options = {
    timeout: 3000,
    position: POSITION.BOTTOM_LEFT
}

const app = createApp(App)

app.use(store)
app.use(router)
app.use(Toast, options)

app.mount('#app')
