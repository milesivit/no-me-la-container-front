import React, { useContext, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ServicioAgregadoContext } from "../../context/ServicioAgregadoContext";
import { useNavigate } from "react-router-dom";

const ServicioAgregadoForm = () => {
  const {
    serviciosAgregados,
    fetchServiciosAgregados,
    deleteServicioAgregado,
    updateServicioAgregado,
    loading,
  } = useContext(ServicioAgregadoContext);

  const toast = useRef(null);
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

  // Abre el modal y carga los valores
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

  // Guarda cambios del modal
  const handleSave = async () => {
    await updateServicioAgregado(selectedServicio.id, formValues);

    toast.current.show({
      severity: "success",
      summary: "Actualizado",
      detail: "Servicio agregado actualizado con éxito",
      life: 3000,
    });

    setEditModalVisible(false);
  };

  const handleDelete = async (id) => {
    await deleteServicioAgregado(id);

    toast.current.show({
      severity: "success",
      summary: "Eliminado",
      detail: "Servicio agregado eliminado con éxito",
      life: 3000,
    });
  };

  // Botones Editar / Eliminar
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
      <Toast ref={toast} />
      <div className="p-4">
        <h1 className="mb-4 text-xl font-semibold">Servicios Agregados</h1>

        <Button
          label="Crear Servicio"
          icon="pi pi-plus"
          className="p-button-success mb-3"
          onClick={() => navigate("/servicio/crear")}
        />

        {loading ? (
          <p>Cargando...</p>
        ) : serviciosAgregados.length === 0 ? (
          <p>No hay servicios agregados registrados.</p>
        ) : (
          <DataTable
            value={serviciosAgregados}
            paginator
            rows={5}
            responsiveLayout="scroll"
            stripedRows
            emptyMessage="No hay servicios registrados."
          >
            <Column field="nombre" header="Nombre" sortable />
            <Column field="codServicio" header="Código" sortable />
            <Column field="coste" header="Costo" sortable />
            <Column body={actionBodyTemplate} header="Acciones" exportable={false} />
          </DataTable>
        )}

        {/* Modal de edición */}
        <Dialog
          header="Editar Servicio Agregado"
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
                id="codServicio"
                name="codServicio"
                value={formValues.codServicio}
                onChange={handleChange}
              />
              <label htmlFor="codServicio">Código</label>
            </span>

            <span className="p-float-label">
              <InputText
                id="coste"
                name="coste"
                value={formValues.coste}
                onChange={handleChange}
              />
              <label htmlFor="coste">Coste</label>
            </span>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default ServicioAgregadoForm;
