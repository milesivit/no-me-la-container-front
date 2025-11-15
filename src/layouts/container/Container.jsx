import React, { useContext, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
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

const ContainerForm = () => {
  const { containers, fetchContainers, deleteContainer, updateContainer, loading } =
    useContext(ContainerContext);

  const toast = useRef(null);
  const navigate = useNavigate();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [estados, setEstados] = useState([]);

  const [formValues, setFormValues] = useState({
    codigo: "",
    capacidad_max: "",
    container_estado_id: ""
  });

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

  const openEditModal = (container) => {
    setSelectedContainer(container);

    setFormValues({
      codigo: container.codigo || "",
      capacidad_max: container.capacidad_max || "",
      container_estado_id: container.container_estado_id || ""
    });

    setEditModalVisible(true);
  };

  const handleSave = async () => {
    try {
      await updateContainer(selectedContainer.id, formValues);

      toast.current.show({
        severity: "success",
        summary: "Actualizado",
        detail: "Container actualizado con éxito",
        life: 3000,
      });

      setEditModalVisible(false);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar",
      });
    }
  };

  const handleDelete = async (id) => {
    await deleteContainer(id);
    toast.current.show({
      severity: "success",
      summary: "Eliminado",
      detail: "Container eliminado con éxito",
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
          label="Crear Estado"
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
            <Column field="capacidad_max" header="Capacidad Máx" />
            <Column field="containersEstados.nombre" header="Estado" />
            <Column body={actionBodyTemplate} header="Acciones" />
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

            {/* Código */}
            <span className="p-float-label">
              <InputText
                id="codigo"
                name="codigo"
                value={formValues.codigo}
                onChange={(e) =>
                  setFormValues({ ...formValues, codigo: e.target.value })
                }
              />
              <label htmlFor="codigo">Código</label>
            </span>

            {/* Capacidad Máxima */}
            <span className="p-float-label">
              <InputNumber
                id="capacidad_max"
                name="capacidad_max"
                value={formValues.capacidad_max}
                onValueChange={(e) =>
                  setFormValues({ ...formValues, capacidad_max: e.value })
                }
              />
              <label htmlFor="capacidad_max">Capacidad Máx</label>
            </span>

            {/* Estado */}
            <span className="p-float-label">
              <Dropdown
                id="container_estado_id"
                name="container_estado_id"
                value={formValues.container_estado_id}
                options={estados}
                optionLabel="nombre"
                optionValue="id"
                placeholder="Seleccionar estado"
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    container_estado_id: e.value,
                  })
                }
                className="w-full"
              />
              <label htmlFor="container_estado_id">Estado</label>
            </span>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default ContainerForm;
