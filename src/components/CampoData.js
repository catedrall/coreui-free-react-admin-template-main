import React, { useState, useRef } from 'react'
registerLocale('pt-br',ptBR)

import "react-datepicker/dist/react-datepicker.css"

const CampoData = (props) => {

    return (
     <DatePicker
        type="date"
        locale="pt-br" 
        dateFormat="dd/MM/yyyy"  
        selected={props.startdate} 
        onChange={props.onChange} 
        value={props.value} 
        className={props.className}
        />
    );  
  }

  export default CampoData