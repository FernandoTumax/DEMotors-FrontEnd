import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faCancel } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import LoadComponent from '../../../components/Load/LoadComponent';
import { ServiceModel } from '../../../models/serviceModel';
import { createService } from '../../../services/serviceService/serviceService';

const ServiceForm = ({ onNewService, closeModal }: { onNewService: (newService: ServiceModel) => void, closeModal: () => void }) => {
    const [service, setService] = useState<string>('');
    const [isTouched, setIsTouched] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!service.trim()) {
            setIsTouched(true);
            return;
        }

        const newService: ServiceModel = {
            ID_SERVICE: 0,
            SERVICE_DESCRIPTION: service,
            USER_CREATED: '',
            DATE_CREATED: '',
            USER_MODIFIED: '',
            DATE_MODIFIED: '',
            STATE: 'A'
        };

        setLoading(true);

        try {
            const { status, message } = await createService(newService);
            setLoading(false);

            if (status === 'SUCCESS') {
                onNewService(newService);
                setService('');
                closeModal();
                toast.success(message, {
                    autoClose: 3000,
                    className: "dark:bg-boxdark dark:text-white"
                });
            }
        } catch (err: any) {
            setLoading(false);
            if (err.status === 'ALERT') {
                toast.warning(err.message, {
                    autoClose: 3000,
                    className: "dark:bg-boxdark dark:text-white"
                });
            } else if (err.status === 'ERROR') {
                toast.error(`Error: ${err.message}`, {
                    autoClose: 3000,
                    className: "dark:bg-boxdark dark:text-white"
                });
            } else {
                toast.error('Error desconocido al crear el Servicio.', {
                    autoClose: 3000,
                    className: "dark:bg-boxdark dark:text-white"
                });
            }
        }
    };

    if (loading) {
        return <LoadComponent />;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                    Pregunta <span className="text-meta-1">*</span>
                </label>
                <input
                    type="text"
                    value={service}
                    onChange={(e) => {
                        setService(e.target.value);
                        setIsTouched(false);
                    }}
                    onBlur={() => setIsTouched(true)}
                    placeholder="Descripción del Servicio"
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${isTouched && !service.trim() ? 'border-red-500' : ''}`}
                    required
                />
                {isTouched && !service.trim() && (
                    <p className="text-red-500 mt-1">La descripción del Servicio es obligatoria.</p>
                )}
            </div>
            <div className="flex justify-end gap-4.5">
                <button
                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    type="button"
                    onClick={() => {
                        setService('');
                        closeModal();
                    }}
                >
                    Cancelar &nbsp;
                    <FontAwesomeIcon icon={faCancel} style={{ marginTop: '5px' }} />
                </button>
                <button
                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                    type="submit"
                >
                    Guardar &nbsp;
                    <FontAwesomeIcon icon={faFileAlt} style={{ marginTop: '5px' }} />
                </button>
            </div>
        </form>
    );
};

export default ServiceForm;