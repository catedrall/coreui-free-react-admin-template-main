export const PESSOA = '@pessoa-id'
export const MEDICO = '@medico'
export const TOKEN_KEY = '@hakaton-Token'
export const GetPessoa = () => localStorage.getItem(PESSOA)
export const GetMedico = () => localStorage.getItem(MEDICO)
export const IsAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null
export const SetToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const SetPessoa = (pessoa) => {
  localStorage.setItem(PESSOA, pessoa)
}
export const SetMedico = (medico) => {
  localStorage.setItem(MEDICO, medico)
}
export const Logout = () => {
  localStorage.removeItem(PESSOA)
}
