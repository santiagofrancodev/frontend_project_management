<template>
  <div>
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <Heading as="h2">Profile</Heading>
      </div>
    </div>

    <div class="mt-8">
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="md:grid md:grid-cols-3 md:gap-6">
            <div class="md:col-span-1">
              <h3 class="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
              <p class="mt-1 text-sm text-gray-500">Update your personal information.</p>
            </div>
            <div class="mt-5 md:col-span-2 md:mt-0">
              <form @submit.prevent="handleSubmit">
                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-6 sm:col-span-3">
                    <FormGroup label="Full name" name="name" type="text" autocomplete="name" required
                      v-model="profileForm.name" :errorMessage="errorBag.name" />
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <FormGroup label="Email address" name="email" type="email" autocomplete="email" required
                      v-model="profileForm.email" :errorMessage="errorBag.email" />
                  </div>
                </div>

                <div class="mt-6">
                  <Button type="submit" :disabled="isSubmitting">
                    <span v-if="isSubmitting">Saving...</span>
                    <span v-else>Save</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const { user, errorBag, resetErrorBag } = useAuth()
const { api } = useAxios()

const profileForm = reactive({
  name: '',
  email: ''
})

const isSubmitting = ref(false)

onMounted(() => {
  if (user.value) {
    profileForm.name = user.value.name
    profileForm.email = user.value.email
  }
})

async function handleSubmit() {
  if (isSubmitting.value) return

  isSubmitting.value = true
  resetErrorBag()

  try {
    const { data } = await api.patch('/api/user/profile', profileForm)
    user.value = data.user
    // Show success message or navigate
  } catch (err) {
    console.error('Profile update error:', err)
    if (err.response) {
      // Handle validation errors
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>