import React, { useContext, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ServicioAgregadoContext } from "../../context/ServicioAgregadoContext";
import { useNavigate } from "react-router-dom";
import "./ServicioForm.css";
import "primeicons/primeicons.css";

const ServicioAgregadoForm = () => {
  const {
    serviciosAgregados,
    fetchServiciosAgregados,
    deleteServicioAgregado,
    updateServicioAgregado,
    loading,
  } = useContext(ServicioAgregadoContext);

  const toast = useRef(null);
  const dt = useRef(null);
  const navigate = useNavigate();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: "",
    codServicio: "",
    coste: "",
  });

  useEffect(() => {
    fetchServiciosAgregados();
  }, []);

  const openEditModal = (servicio) => {
    setSelectedServicio(servicio);
    setFormValues({
      nombre: servicio.nombre || "",
      codServicio: servicio.codServicio || "",
      coste: servicio.coste || "",
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
    await updateServicioAgregado(selectedServicio.id, formValues);
    toast.current.show({
      severity: "success",
      summary: "Actualizado",
      detail: "Servicio actualizado con éxito",
      life: 3000,
    });
    setEditModalVisible(false);
  };

  const handleDelete = async (id) => {
    await deleteServicioAgregado(id);
    toast.current.show({
      severity: "success",
      summary: "Eliminado",
      detail: "Servicio eliminado con éxito",
      life: 3000,
    });
  };

  const confirmDelete = (servicio) => {
    confirmDialog({
      message: `¿Está seguro que desea eliminar el servicio "${servicio.nombre}"?`,
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí",
      rejectLabel: "No",
      acceptClassName: "p-button-success",
      rejectClassName: "p-button-secondary",
      accept: () => handleDelete(servicio.id),
    });
  };

  const actionBodyTemplate = (rowData) => (
    <div className="servicio-action-buttons">
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
    <div className="servicio-header">
      <h1 className="servicio-title">Servicios Agregados</h1>
      <div className="servicio-header-actions">
        <Button
          label="Crear Servicio"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={() => navigate("/servicio/crear")}
        />
        <Button
          type="button"
          icon="pi pi-file"
          rounded
          tooltip="Exportar"
          tooltipOptions={{ position: "top" }}
          onClick={() => dt.current.exportCSV()}
        />
      </div>
    </div>
  );

  return (
    <div className="servicio-page">
      <div className="servicio-page-container">
        <Toast ref={toast} />
        <ConfirmDialog />

        {loading ? (
          <p>Cargando servicios...</p>
        ) : serviciosAgregados.length === 0 ? (
          <p>No hay servicios registrados.</p>
        ) : (
          <div className="servicio-table-wrapper">
            <DataTable
              ref={dt}
              value={serviciosAgregados}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]}
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No hay servicios registrados."
              className="servicio-table"
              header={headerTemplate}
            >
              <Column field="nombre" header="Nombre" sortable />
              <Column field="codServicio" header="Código" sortable />
              <Column field="coste" header="Costo" sortable />
              <Column body={actionBodyTemplate} header="Acciones" exportable={false} />
            </DataTable>
          </div>
        )}

        <Dialog
          header="Editar Servicio"
          visible={editModalVisible}
          modal
          className="servicio-modal"
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
          <div className="servicio-modal-form">
            <div className="servicio-form-group">
              <label htmlFor="nombre">Nombre</label>
              <InputText
                id="nombre"
                name="nombre"
                value={formValues.nombre}
                onChange={handleChange}
                className="servicio-input"
              />
            </div>
            <div className="servicio-form-group">
              <label htmlFor="codServicio">Código</label>
              <InputText
                id="codServicio"
                name="codServicio"
                value={formValues.codServicio}
                onChange={handleChange}
                className="servicio-input"
              />
            </div>
            <div className="servicio-form-group">
              <label htmlFor="coste">Coste</label>
              <InputText
                id="coste"
                name="coste"
                value={formValues.coste}
                onChange={handleChange}
                className="servicio-input"
              />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default ServicioAgregadoForm;
