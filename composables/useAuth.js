export default function useAuth() {
    const user = useState('auth-user', () => null)

    const { errorBag, transformValidationErrors, resetErrorBag } = useCustomError()

    const { api, csrf } = useAxios()

    async function me() {
        try {
            const data = await api.get("/api/me")
            user.value = data.data
        } catch (e) {
            user.value = null
            console.log("Error fetching user:", e)
        }
    }

    async function login(userForm) {
        resetErrorBag()
        
        try {
            // 1. Obtener CSRF token
            await csrf()
            
            // 2. Intentar login
            const { data } = await api.post("/login", userForm)
            
            // 3. Solo si el login fue exitoso, guardar usuario
            user.value = data.user
            
            // 4. Guardar token en cookie
            await $fetch('/api/set-cookie', {
                method: "POST",
                body: { token: data.token }
            })
            
            // 5. Solo navegar si TODO fue exitoso
            navigateTo("/dashboard")
            
        } catch (err) {
            // Si hay error, NO navegar y mostrar errores
            console.error("Login error:", err)
            if (err.response) {
                transformValidationErrors(err.response)
            }
            // Asegurar que el usuario esté limpio
            user.value = null
        }
    }

    async function logout() {
        try {
            // 1. Intentar logout en el backend (si hay sesión)
            if (user.value) {
                await api.post("/api/logout")
            }
        } catch (err) {
            console.error("Backend logout error:", err)
            // Continuar con el logout local aunque falle el backend
        } finally {
            // 2. Siempre limpiar usuario local
            user.value = null
            
            // 3. Limpiar cookie en el frontend
            try {
                await $fetch('/api/logout', {
                    method: "POST",
                })
            } catch (err) {
                console.error("Frontend logout error:", err)
            }
            
            // 4. Siempre redirigir al home
            navigateTo("/")
        }
    }

    async function register(userForm) {
        resetErrorBag()
        
        try {
            // 1. Obtener CSRF token
            await csrf()
            
            // 2. Intentar registro
            const { data } = await api.post("/register", userForm)
            
            // 3. Si fue exitoso, guardar usuario
            user.value = data.user
            
            // 4. Guardar token
            await $fetch('/api/set-cookie', {
                method: "POST",
                body: { token: data.token }
            })
            
            // 5. Redirigir a verificación de email o dashboard
            navigateTo("/verify-email")
            
        } catch (err) {
            console.error("Register error:", err)
            if (err.response) {
                transformValidationErrors(err.response)
            }
            user.value = null
        }
    }

    return { login, logout, register, errorBag, resetErrorBag, user, me }
}