import Cookie from 'js-cookie'
import functions from 'v-functions'
import { execute } from '../helper/clientApi'
import presets from './globalPresets'

/**
 * @brief Objeto con funciones comunes de ambiente
 */
const environment = {
  /**
   * @brief Obtiene el token de los Cookies y el usuario del LocalStorage
   * @param {*} callback funcion a ejecutar cuando se obtuvieron los datos
   * @returns 
   */
  getEnvUser: () => {
    return new Promise((resolve, reject) => {
      const token = Cookie.get(`${process.env.idApp}:${process.env.NODE_ENV}`)
      const user = functions.getDecodeStorage(`${process.env.idApp}/${process.env.NODE_ENV}`)
      if (!token || !user) {
        resolve({token: undefined, user: undefined, redirectPath: `/login`})
      }
      resolve({ token, user })
    })
  },
  logout: () => {
    return new Promise((resolve, reject) => {
      Cookie.remove(`${process.env.idApp}:${process.env.NODE_ENV}`)
      functions.setEncodeStorage(`${process.env.idApp}/${process.env.NODE_ENV}`, '')
      resolve('/')
    })
  },
  getTime: () => {
    // return (new Date()).getTime()
    return 1668220842700
  },
  validaResultadoDB: (resultado, i18n, toast, showOKMessage = false) => {
    if (resultado === undefined) {
      if (i18n && toast) {
        toast.error(i18n.t('comun.errorApi'), presets.toaster)
      }
      return false
    }
    if (Array.isArray(resultado) && resultado.length > 0) {
      if (resultado[0].status === 'ERROR') {
        if (i18n && toast) {
          toast.error(resultado[0].message, presets.toaster)
        }
        return false
      } else if (resultado[0].status === 'WARNING') {
        if (i18n && toast) {
          toast.warning(resultado[0].message, presets.toaster)
        }
        return false
      } else if (resultado[0].status === 'OK') {
        if (i18n && toast && showOKMessage === true) {
          toast.success(resultado[0].message, presets.toaster)
        }
      }
    }
    return true
  },
  validaPermisos: async (token, administra, configura, graba_modifica, consulta) => {
    let permisos = await execute('FUN_INFO_SESION_ENTIDAD', [token])
    if (permisos === undefined || permisos.length <= 0) {
      return false
    }
    if (permisos[0].status === 'ERROR') {
      return false
    } else if (permisos[0].status === 'WARNING') {
      return false
    } else {
      permisos = permisos[0]
      const secVal = []
      if (permisos.administra === 'S') {
        return true
      } else if (permisos.configura === 'S') {
        secVal.push(2)
      } else if (permisos.graba_modifica === 'S') {
        secVal.push(3)
      } else if (permisos.consulta === 'S') {
        secVal.push(4)
      }
      if (configura === 'S' && secVal.includes(2) === true) {
        return true
      } else if (graba_modifica === 'S' && secVal.includes(3) === true) {
        return true
      } else if (consulta === 'S' && secVal.includes(4) === true) {
        return true
      }
      return false
    }
  }
}

export default environment
