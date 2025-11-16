import React, { useContext, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { BarcoContext } from "../../context/BarcoContext";
import { useNavigate } from "react-router-dom";
import "./Barco.css";
import 'primeicons/primeicons.css';

const BarcoForm = () => {
  const { barcos, fetchBarcos, deleteBarco, updateBarco, loading } =
    useContext(BarcoContext);

  const toast = useRef(null);
  const dt = useRef(null);
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

  // Función para confirmar eliminación
  const confirmDelete = (barco) => {
    confirmDialog({
      message: `¿Está seguro que desea eliminar el barco "${barco.nombre}"?`,
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí",
      rejectLabel: "No",
      acceptClassName: "p-button-success",
      rejectClassName: "p-button-secondary",
      accept: () => handleDelete(barco.id),
      reject: () => {},
    });
  };

  const actionBodyTemplate = (rowData) => (
    <div className="barco-action-buttons">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-info p-button-sm"
        onClick={() => openEditModal(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger p-button-sm"
        onClick={() => confirmDelete(rowData)}
      />
    </div>
  );

  const headerTemplate = (
    <div className="barco-header">
      <h1 className="barco-title">Lista de Barcos</h1>

      <div className="barco-header-actions">
        <Button
          label="Crear Barco"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={() => navigate("/flota/crear")}
        />
        <Button
          type="button"
          icon="pi pi-file"
          rounded
          tooltip="Exportar"
          tooltipOptions={{ position: 'top' }}
          onClick={() => dt.current.exportCSV()}
        />
      </div>
    </div>
  );

  return (
    <div className="barco-page">
      <div className="barco-page-container">
        <Toast ref={toast} />
        <ConfirmDialog /> {/* Aquí se monta el dialog */}

        {loading ? (
          <p>Cargando barcos...</p>
        ) : barcos.length === 0 ? (
          <p>No hay barcos registrados.</p>
        ) : (
          <div className="barco-table-wrapper">
            <DataTable
              ref={dt}
              value={barcos}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]}
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No hay barcos registrados."
              className="barco-table"
              header={headerTemplate}
            >
              <Column field="nombre" header="Nombre" sortable />
              <Column field="nroMatricula" header="Matrícula" sortable />
              <Column field="nroRegistro" header="Registro" sortable />
              <Column field="modelo" header="Modelo" sortable />
              <Column field="constructura" header="Constructora" sortable />
              <Column
                field="capacidadMaxContainer"
                header="Cap. Máx."
                sortable
              />
              <Column
                body={actionBodyTemplate}
                header="Acciones"
                exportable={false}
              />
            </DataTable>
          </div>
        )}

        {/* MODAL EDITAR */}
        <Dialog
          header="Editar Barco"
          visible={editModalVisible}
          modal
          className="barco-modal"
          onHide={() => setEditModalVisible(false)}
          footer={
            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-secondary"
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
          <div className="barco-modal-form">
            <div className="barco-form-group">
              <label htmlFor="nombre">Nombre</label>
              <InputText
                id="nombre"
                name="nombre"
                value={formValues.nombre}
                onChange={handleChange}
                className="barco-input"
              />
            </div>

            <div className="barco-form-group">
              <label htmlFor="nroMatricula">Matrícula</label>
              <InputText
                id="nroMatricula"
                name="nroMatricula"
                value={formValues.nroMatricula}
                onChange={handleChange}
                className="barco-input"
              />
            </div>

            <div className="barco-form-group">
              <label htmlFor="nroRegistro">Registro</label>
              <InputText
                id="nroRegistro"
                name="nroRegistro"
                value={formValues.nroRegistro}
                onChange={handleChange}
                className="barco-input"
              />
            </div>

            <div className="barco-form-group">
              <label htmlFor="modelo">Modelo</label>
              <InputText
                id="modelo"
                name="modelo"
                value={formValues.modelo}
                onChange={handleChange}
                className="barco-input"
              />
            </div>

            <div className="barco-form-group">
              <label htmlFor="constructura">Constructora</label>
              <InputText
                id="constructura"
                name="constructura"
                value={formValues.constructura}
                onChange={handleChange}
                className="barco-input"
              />
            </div>

            <div className="barco-form-group">
              <label htmlFor="capacidadMaxContainer">Capacidad Máxima</label>
              <InputText
                id="capacidadMaxContainer"
                name="capacidadMaxContainer"
                value={formValues.capacidadMaxContainer}
                onChange={handleChange}
                className="barco-input"
              />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default BarcoForm;
