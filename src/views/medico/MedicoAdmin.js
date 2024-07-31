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
  CTabPane,
} from '@coreui/react'
import ListaMedica from './agenda/ListaMedica'

const PacienteAdmin = () => {
  const [activeKey, setActiveKey] = useState(1)
  return (
    <>
      <CRow>
        <CCol xs={12} sm={6}>
          <h4>Administração de agendas</h4>
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
                    Agendas
                  </CNavLink>
                </CNavItem>
                {/* <CNavItem>
                  <CNavLink
                    href="javascript:void(0);"
                    active={activeKey == 5}
                    onClick={() => setActiveKey(5)}
                  >
                    Entregas
                  </CNavLink>
                </CNavItem> */}
              </CNav>
              <CTabContent>
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                  <ListaMedica />
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
