export default defineNuxtRouteMiddleware(async (to, from) => {
    const { user, me } = useAuth()
    
    // Si no hay usuario en el estado, intentar obtenerlo del backend
    if (!user.value) {
        await me()
    }
    
    // Verificar si realmente hay un usuario autenticado en el backend
    // No solo verificar cookies, sino el estado del usuario
    if (!user.value) {
        return navigateTo('/')
    }
})