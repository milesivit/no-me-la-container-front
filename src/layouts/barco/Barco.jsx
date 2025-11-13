import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { BarcoContext } from "../../context/BarcoContext";
import { useNavigate } from "react-router-dom";

const BarcoForm = () => {
  const { barcos, fetchBarcos, deleteBarco, updateBarco, loading } =
    useContext(BarcoContext);
  const toast = useRef(null);
  const navigate = useNavigate();


  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBarco, setSelectedBarco] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: "",
    nroMatricula: "",
    nroRegistro: "",
    modelo: "",
    constructura: "",
    capacidadMaxContainer: "",
  });

  useEffect(() => {
    fetchBarcos();
  }, []);

  //muestra datos en el formulario del modal
  const openEditModal = (barco) => {
    setSelectedBarco(barco);
    setFormValues({
      nombre: barco.nombre || "",
      nroMatricula: barco.nroMatricula || "",
      nroRegistro: barco.nroRegistro || "",
      modelo: barco.modelo || "",
      constructura: barco.constructura || "",
      capacidadMaxContainer: barco.capacidadMaxContainer || "",
    });
    setEditModalVisible(true);
  };

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  //guarda cambios
  const handleSave = async () => {
    await updateBarco(selectedBarco.id, formValues);
    toast.current.show({
      severity: "success",
      summary: "Actualizado",
      detail: "Barco actualizado con éxito",
      life: 3000,
    });
    setEditModalVisible(false);
  };

  const handleDelete = async (id) => {
    await deleteBarco(id);
    toast.current.show({
      severity: "success",
      summary: "Eliminado",
      detail: "Barco eliminado con éxito",
      life: 3000,
    });
  };

  //botones de acción (editar / eliminar)
  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-info p-button-sm"
        onClick={() => openEditModal(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger p-button-sm"
        onClick={() => handleDelete(rowData.id)}
      />
    </div>
  );

  return (
    <div>
      <Navbar />
      <Toast ref={toast} />
      <div className="p-4">
        <h1 className="mb-4 text-xl font-semibold">Lista de Barcos</h1>
        <Button
          label="Crear Barco"
          icon="pi pi-plus"
          className="p-button-success mb-3"
          onClick={() => navigate("/flota/crear")}
        />

        {loading ? (
          <p>Cargando barcos...</p>
        ) : barcos.length === 0 ? (
          <p>No hay barcos registrados.</p>
        ) : (
          <DataTable
            value={barcos}
            paginator
            rows={5}
            responsiveLayout="scroll"
            stripedRows
            emptyMessage="No hay barcos registrados."
          >
            <Column field="nombre" header="Nombre" sortable />
            <Column field="nroMatricula" header="Matrícula" sortable />
            <Column field="nroRegistro" header="Registro" sortable />
            <Column field="modelo" header="Modelo" />
            <Column field="constructura" header="Constructora" />
            <Column
              field="capacidadMaxContainer"
              header="Cap. Máx. (containers)"
            />
            <Column body={actionBodyTemplate} header="Acciones" exportable={false} />
          </DataTable>
        )}

        {/*modal de edición */}
        <Dialog
          header="Editar Barco"
          visible={editModalVisible}
          style={{ width: "30rem" }}
          modal
          onHide={() => setEditModalVisible(false)}
          footer={
            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => setEditModalVisible(false)}
              />
              <Button
                label="Guardar"
                icon="pi pi-check"
                className="p-button-success"
                onClick={handleSave}
              />
            </div>
          }
        >
          <div className="flex flex-column gap-3 mt-3">
            <span className="p-float-label">
              <InputText
                id="nombre"
                name="nombre"
                value={formValues.nombre}
                onChange={handleChange}
              />
              <label htmlFor="nombre">Nombre</label>
            </span>
            <span className="p-float-label">
              <InputText
                id="nroMatricula"
                name="nroMatricula"
                value={formValues.nroMatricula}
                onChange={handleChange}
              />
              <label htmlFor="nroMatricula">Matrícula</label>
            </span>
            <span className="p-float-label">
              <InputText
                id="nroRegistro"
                name="nroRegistro"
                value={formValues.nroRegistro}
                onChange={handleChange}
              />
              <label htmlFor="nroRegistro">Registro</label>
            </span>
            <span className="p-float-label">
              <InputText
                id="modelo"
                name="modelo"
                value={formValues.modelo}
                onChange={handleChange}
              />
              <label htmlFor="modelo">Modelo</label>
            </span>
            <span className="p-float-label">
              <InputText
                id="constructura"
                name="constructura"
                value={formValues.constructura}
                onChange={handleChange}
              />
              <label htmlFor="constructura">Constructora</label>
            </span>
            <span className="p-float-label">
              <InputText
                id="capacidadMaxContainer"
                name="capacidadMaxContainer"
                value={formValues.capacidadMaxContainer}
                onChange={handleChange}
              />
              <label htmlFor="capacidadMaxContainer">Capacidad Máxima</label>
            </span>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default BarcoForm;
