import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from '@coreui/react'
import Cadastro from './cadastro/Cadastro'
import CadastroAgenda from './agenda/CadastroAgenda'
import Lista from './cadastro/Lista'

const PacienteAdmin = () => {
  const [activeKey, setActiveKey] = useState(1)
  
  return (
    <>
      <CRow>
        <CCol xs={12} sm={6}>
          <h4>Administração de pacientes</h4>
        </CCol>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Gerenciar informações</strong>
            </CCardHeader>
            <CCardBody className="row g-3">
              <CNav variant="tabs" role="tablist">
                <CNavItem>
                  <CNavLink
                    href="javascript:void(0);"
                    active={activeKey === 1}
                    onClick={() => setActiveKey(1)}
                  >
                    Cadastro
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    href="javascript:void(0);"
                    active={activeKey === 2}
                    onClick={() => setActiveKey(2)}
                  >
                    Fazer agendamento
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    href="javascript:void(0);"
                    active={activeKey == 3}
                    onClick={() => setActiveKey(3)}
                  >
                    Consultas agendadas
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                  <Cadastro />
                </CTabPane>
                <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
                  {activeKey === 2  && <CadastroAgenda />}
                </CTabPane>
                <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 3}>
                  {activeKey === 3 && <Lista />}
                </CTabPane>
              </CTabContent>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
export default PacienteAdmin
