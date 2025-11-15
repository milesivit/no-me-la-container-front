import React, { useContext, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ContainerContext } from "../../context/ContainerContext";
import { useNavigate } from "react-router-dom";

const ContainerForm = () => {
  const { containers, fetchContainers, deleteContainer, updateContainer, loading } =
    useContext(ContainerContext);

  const toast = useRef(null);
  const navigate = useNavigate();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);

  const [formValues, setFormValues] = useState({
    codigo: "",
    tipo: "",
    tamaño: "",
    estado: "",
    ubicacion: "",
  });

  useEffect(() => {
    fetchContainers();
  }, []);

  const openEditModal = (container) => {
    setSelectedContainer(container);
    setFormValues({
      codigo: container.codigo || "",
      tipo: container.tipo || "",
      tamaño: container.tamaño || "",
      estado: container.estado || "",
      ubicacion: container.ubicacion || "",
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
        <h1 className="mb-4 text-xl font-semibold">Lista de Containers</h1>

        <Button
          label="Crear Container"
          icon="pi pi-plus"
          className="p-button-success mb-3"
          onClick={() => navigate("/container/crear")}
        />

        <Button
          label="Crear Container Estado"
          icon="pi pi-cog"
          className="p-button-info mb-3 ml-3"
          onClick={() => navigate("/container/estado/crear")}
        />

        {loading ? (
          <p>Cargando containers...</p>
        ) : containers.length === 0 ? (
          <p>No hay containers registrados.</p>
        ) : (
          <DataTable value={containers} paginator rows={5} stripedRows>
            <Column field="codigo" header="Código" sortable />
            <Column field="tipo" header="Tipo" />
            <Column field="tamaño" header="Tamaño" />
            <Column field="estado" header="Estado" />
            <Column field="ubicacion" header="Ubicación" />
            <Column body={actionBodyTemplate} header="Acciones" exportable={false} />
          </DataTable>
        )}

        {/* MODAL DE EDICIÓN */}
        <Dialog
          header="Editar Container"
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
              <InputText id="codigo" name="codigo" value={formValues.codigo} onChange={handleChange} />
              <label htmlFor="codigo">Código</label>
            </span>

            <span className="p-float-label">
              <InputText id="tipo" name="tipo" value={formValues.tipo} onChange={handleChange} />
              <label htmlFor="tipo">Tipo</label>
            </span>

            <span className="p-float-label">
              <InputText id="tamaño" name="tamaño" value={formValues.tamaño} onChange={handleChange} />
              <label htmlFor="tamaño">Tamaño</label>
            </span>

            <span className="p-float-label">
              <InputText id="estado" name="estado" value={formValues.estado} onChange={handleChange} />
              <label htmlFor="estado">Estado</label>
            </span>

            <span className="p-float-label">
              <InputText id="ubicacion" name="ubicacion" value={formValues.ubicacion} onChange={handleChange} />
              <label htmlFor="ubicacion">Ubicación</label>
            </span>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default ContainerForm;
