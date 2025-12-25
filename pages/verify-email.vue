<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div class="text-center">
                    <svg class="mx-auto h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    
                    <h2 class="mt-6 text-2xl font-bold text-gray-900">
                        Verify your email
                    </h2>
                    
                    <p class="mt-2 text-sm text-gray-600">
                        We've sent a verification email to <strong>{{ user?.email }}</strong>
                    </p>
                    
                    <p class="mt-4 text-sm text-gray-600">
                        Please check your inbox and click the verification link to activate your account.
                    </p>
                </div>

                <div class="mt-6">
                    <button 
                        @click="resendVerification" 
                        :disabled="isResending"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        <span v-if="isResending">Sending...</span>
                        <span v-else>Resend verification email</span>
                    </button>
                    
                    <p v-if="resendSuccess" class="mt-2 text-sm text-green-600 text-center">
                        Verification email sent successfully!
                    </p>
                </div>

                <div class="mt-6 text-center">
                    <NuxtLink to="/dashboard" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Continue to dashboard →
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
    middleware: ['auth']
})

const { user } = useAuth()
const { api } = useAxios()

const isResending = ref(false)
const resendSuccess = ref(false)

async function resendVerification() {
    isResending.value = true
    resendSuccess.value = false
    
    try {
        await api.post('/api/email/verification-notification')
        resendSuccess.value = true
    } catch (error) {
        console.error('Failed to resend verification email:', error)
    } finally {
        isResending.value = false
    }
}
</script>