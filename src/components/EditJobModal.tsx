import { Modal, Form, Input } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";
import { AddNewJobFieldValues, Job } from "../types";
import { useAllJobs } from "../hooks/useAllJobs";
import { FloppyDisk, WarningCircle } from "phosphor-react";
import { toast } from "react-hot-toast";

interface EditJobModalProps {
  open: boolean;
  closeModal: () => void;
  job: Job;
}

export function EditJobModal({ open, closeModal, job }: EditJobModalProps) {
  const { user } = useAuth();
  const { allJobs } = useAllJobs();
  const [form] = Form.useForm();

  async function handleSubmitEditJob() {
    if (!allJobs) {
      return;
    }

    const { title, dailyHours, totalHours } = form.getFieldsValue() as AddNewJobFieldValues;

    const updatedJobs = allJobs.reduce((accumulator: Job[], currentJob: Job) => {
      if (currentJob.id === job.id) {
        return [
          ...accumulator,
          {
            ...currentJob,
            title: title,
            dailyHours: Number(dailyHours),
            totalHours: Number(totalHours),
          },
        ];
      }

      return [...accumulator, currentJob];
    }, []);

    if (JSON.stringify(allJobs) === JSON.stringify(updatedJobs)) {
      toast("Nenhuma alteração foi feita.", {
        id: "#5@",
        position: "bottom-right",
        icon: <WarningCircle size={32} className="text-orange-400" />,
      });
      return;
    }

    if (user?.email) {
      const docRef = doc(db, "users", user.email);

      await updateDoc(docRef, {
        jobs: updatedJobs,
      });

      handleClose();
    }
  }

  function handleClose() {
    closeModal();
    form.resetFields();
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title="Editar Job"
      style={{ paddingInline: "8px" }}
      width={864}
      bodyStyle={{ padding: 16, backgroundColor: "#f2f2f2" }}
      maskStyle={{ backdropFilter: "blur(2px)" }}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={handleSubmitEditJob}
        initialValues={{
          title: job.title,
          dailyHours: job.dailyHours,
          totalHours: job.totalHours,
        }}
        className="flex flex-col"
        layout="vertical"
      >
        <Form.Item
          label="Título"
          name="title"
          rules={[{ required: true, message: "Campo obrigatório." }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Quantas horas por dia vai dedicar ao este job?"
          name="dailyHours"
          rules={[{ required: true, message: "Campo obrigatório." }]}
        >
          <Input type="number" max={24} min={0} />
        </Form.Item>

        <Form.Item
          label="Estimativa de horas totais ao job"
          name="totalHours"
          rules={[{ required: true, message: "Campo obrigatório." }]}
        >
          <Input type="number" min={0} />
        </Form.Item>

        <button
          key={0}
          type="submit"
          onClick={() => form.submit()}
          className="flex items-center w-fit self-end justify-center gap-1 rounded bg-emerald-600 hover:bg-emerald-700 transition text-xl px-4 py-2 text-zinc-100"
        >
          <FloppyDisk size={32} />
          Salvar
        </button>
      </Form>
    </Modal>
  );
}
