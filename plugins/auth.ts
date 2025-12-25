export default defineNuxtPlugin(async (nuxtApp) => {
    const { me } = useAuth()
    
    // Solo en el cliente, intentar cargar el usuario al iniciar la app
    if (process.client) {
        await me()
    }
})