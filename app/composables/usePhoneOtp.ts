import { ref } from 'vue'
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type Auth,
} from 'firebase/auth'

const otpSent = ref(false)
const otpVerified = ref(false)
const otpLoading = ref(false)
const otpError = ref('')
let confirmationResult: ConfirmationResult | null = null
let recaptchaVerifier: RecaptchaVerifier | null = null

export const usePhoneOtp = () => {
  const { $firebaseAuth } = useNuxtApp()
  const auth = $firebaseAuth as Auth

  /**
   * Initialise le reCAPTCHA invisible sur un bouton
   */
  const initRecaptcha = (buttonId: string) => {
    if (recaptchaVerifier) {
      recaptchaVerifier.clear()
    }
    recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
      size: 'invisible',
    })
  }

  /**
   * Envoie le code OTP au numéro de téléphone
   */
  const sendOtp = async (phoneNumber: string) => {
    otpError.value = ''
    otpLoading.value = true
    otpSent.value = false

    try {
      if (!recaptchaVerifier) {
        throw new Error('reCAPTCHA non initialisé')
      }

      // Formater le numéro au format E.164 (+225XXXXXXXXXX)
      // 1. Retirer tout sauf les chiffres et le +
      let formattedPhone = phoneNumber.trim().replace(/[^\d+]/g, '')

      // 2. Si le numéro commence par 00XXX, remplacer par +XXX
      if (formattedPhone.startsWith('00')) {
        formattedPhone = '+' + formattedPhone.slice(2)
      }
      // 3. Si pas de +, ajouter +237 (Cameroun) par défaut
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+237' + formattedPhone
      }

      console.log('[OTP] Numéro formaté:', formattedPhone)

      confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier)
      otpSent.value = true
    } catch (err: any) {
      otpError.value = getFirebaseErrorMessage(err.code)
      // Recréer le reCAPTCHA en cas d'erreur
      if (recaptchaVerifier) {
        recaptchaVerifier.clear()
        recaptchaVerifier = null
      }
    } finally {
      otpLoading.value = false
    }
  }

  /**
   * Vérifie le code OTP saisi par l'utilisateur
   */
  const verifyOtp = async (code: string) => {
    otpError.value = ''
    otpLoading.value = true
    otpVerified.value = false

    try {
      if (!confirmationResult) {
        throw new Error('Aucun code OTP envoyé')
      }

      const result = await confirmationResult.confirm(code)
      otpVerified.value = true

      return result.user
    } catch (err: any) {
      otpError.value = getFirebaseErrorMessage(err.code)
      return null
    } finally {
      otpLoading.value = false
    }
  }

  /**
   * Réinitialiser l'état OTP
   */
  const resetOtp = () => {
    otpSent.value = false
    otpVerified.value = false
    otpError.value = ''
    otpLoading.value = false
    confirmationResult = null
    if (recaptchaVerifier) {
      recaptchaVerifier.clear()
      recaptchaVerifier = null
    }
  }

  return {
    otpSent,
    otpVerified,
    otpLoading,
    otpError,
    initRecaptcha,
    sendOtp,
    verifyOtp,
    resetOtp,
  }
}

/**
 * Messages d'erreur Firebase en français
 */
function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-phone-number':
      return 'Le numéro de téléphone est invalide'
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Veuillez réessayer plus tard'
    case 'auth/invalid-verification-code':
      return 'Le code OTP est incorrect'
    case 'auth/code-expired':
      return 'Le code OTP a expiré. Veuillez en demander un nouveau'
    case 'auth/missing-phone-number':
      return 'Veuillez entrer un numéro de téléphone'
    case 'auth/quota-exceeded':
      return 'Quota dépassé. Veuillez réessayer plus tard'
    case 'auth/captcha-check-failed':
      return 'Vérification captcha échouée. Veuillez rafraîchir la page'
    default:
      return 'Une erreur est survenue. Veuillez réessayer'
  }
}
