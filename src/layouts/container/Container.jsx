import React, { useContext, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { ContainerContext } from "../../context/ContainerContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Container.css";
import "primeicons/primeicons.css";

const ContainerForm = () => {
  const { containers, fetchContainers, deleteContainer, updateContainer, loading } =
    useContext(ContainerContext);

  const toast = useRef(null);
  const dt = useRef(null);
  const navigate = useNavigate();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [estados, setEstados] = useState([]);
  const [formValues, setFormValues] = useState({
    codigo: "",
    capacidad_max: "",
    container_estado_id: "",
  });

  // Cargar containers y estados al iniciar
  useEffect(() => {
    fetchContainers();
    fetchEstados();
  }, []);

  const fetchEstados = async () => {
    try {
      const res = await axios.get("http://localhost:3000/containerestado");
      setEstados(res.data.data || res.data);
    } catch (error) {
      console.error("Error cargando estados:", error);
    }
  };

  // Abrir modal de edición y mantener valores actuales
  const openEditModal = (container) => {
    setSelectedContainer(container);
    setFormValues({
      codigo: container.codigo || "",
      capacidad_max: container.capacidad_max || "",
      container_estado_id: container.container_estado_id || "", // mantiene el estado seleccionado
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
    await updateContainer(selectedContainer.id, formValues);
    toast.current.show({
      severity: "success",
      summary: "Actualizado",
      detail: "Container actualizado con éxito",
      life: 3000,
    });
    setEditModalVisible(false);
  };

  const handleDelete = async (id) => {
    await deleteContainer(id);
    toast.current.show({
      severity: "success",
      summary: "Eliminado",
      detail: "Container eliminado con éxito",
      life: 3000,
    });
  };

  const confirmDelete = (container) => {
    confirmDialog({
      message: `¿Está seguro que desea eliminar el container "${container.codigo}"?`,
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí",
      rejectLabel: "No",
      acceptClassName: "p-button-success",
      rejectClassName: "p-button-secondary",
      accept: () => handleDelete(container.id),
    });
  };

  const actionBodyTemplate = (rowData) => (
    <div className="container-action-buttons">
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
    <div className="container-header">
      <h1 className="container-title">Lista de Containers</h1>

      <div className="container-header-actions">
        <Button
          label="Crear Container"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={() => navigate("/container/crear")}
        />

        <Button
          label="Crear Estado"
          icon="pi pi-cog"
          className="p-button-info"
          onClick={() => navigate("/container/estado/crear")}
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
    <div className="container-page">
      <div className="container-page-container">
        <Toast ref={toast} />
        <ConfirmDialog />

        {loading ? (
          <p>Cargando containers...</p>
        ) : containers.length === 0 ? (
          <p>No hay containers registrados.</p>
        ) : (
          <div className="container-table-wrapper">
            <DataTable
              ref={dt}
              value={containers}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]}
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No hay containers registrados."
              className="container-table"
              header={headerTemplate}
            >
              <Column field="codigo" header="Código" sortable />
              <Column field="capacidad_max" header="Cap. Máx." sortable />
              <Column
                field="containersEstados.nombre"
                header="Estado"
                sortable
              />
              <Column body={actionBodyTemplate} header="Acciones" exportable={false} />
            </DataTable>
          </div>
        )}

        {/* MODAL */}
        <Dialog
          header="Editar Container"
          visible={editModalVisible}
          modal
          className="container-modal"
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
          <div className="container-modal-form">
            {/* Todos los campos unificados visualmente */}
            <div className="container-form-group">
              <label htmlFor="codigo">Código</label>
              <InputText
                id="codigo"
                name="codigo"
                value={formValues.codigo}
                onChange={handleChange}
                className="container-input"
              />
            </div>

            <div className="container-form-group">
              <label htmlFor="capacidad_max">Capacidad Máxima</label>
              <InputNumber
                id="capacidad_max"
                name="capacidad_max"
                value={formValues.capacidad_max}
                onValueChange={(e) =>
                  setFormValues({ ...formValues, capacidad_max: e.value })
                }
                className="container-input"
              />
            </div>

            <div className="container-form-group">
              <label htmlFor="container_estado_id">Estado</label>
              <Dropdown
                id="container_estado_id"
                name="container_estado_id"
                value={formValues.container_estado_id} // mantiene valor
                options={estados}
                optionLabel="nombre"
                optionValue="id"
                placeholder="Seleccionar estado"
                onChange={(e) =>
                  setFormValues({ ...formValues, container_estado_id: e.value })
                }
                className="container-input w-full"
              />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default ContainerForm;
