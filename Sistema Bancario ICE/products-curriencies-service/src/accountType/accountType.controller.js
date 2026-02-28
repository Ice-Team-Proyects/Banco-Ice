import AccountType from './accountType.model.js';

export const createAccountType = async (req, res) => {
    try {
        const data = req.body;
        const newAccountType = new AccountType(data);
        await newAccountType.save();
        
        return res.status(201).send({ message: 'Tipo de cuenta creado exitosamente', accountType: newAccountType });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al crear el tipo de cuenta', error: err.message });
    }
};

export const getAccountTypes = async (req, res) => {
    try {
        const accountTypes = await AccountType.find({ status: true });
        return res.status(200).send({ accountTypes });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al obtener los tipos de cuenta' });
    }
};

export const updateAccountType = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const updatedAccountType = await AccountType.findByIdAndUpdate(id, data, { new: true });
        if (!updatedAccountType) return res.status(404).send({ message: 'Tipo de cuenta no encontrado' });

        return res.status(200).send({ message: 'Tipo de cuenta actualizado', accountType: updatedAccountType });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar el tipo de cuenta' });
    }
};

export const deleteAccountType = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAccountType = await AccountType.findByIdAndUpdate(id, { status: false }, { new: true });
        
        if (!deletedAccountType) return res.status(404).send({ message: 'Tipo de cuenta no encontrado' });

        return res.status(200).send({ message: 'Tipo de cuenta desactivado exitosamente' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al eliminar el tipo de cuenta' });
    }
};