export default defineNuxtRouteMiddleware(async (to, from) => {
    const { user, me } = useAuth()
    
    // Intentar obtener el usuario del backend si no está en el estado
    if (!user.value) {
        await me()
    }
    
    // Si hay un usuario realmente autenticado (no solo cookies), redirigir al dashboard
    if (user.value) {
        return navigateTo('/dashboard')
    }
})