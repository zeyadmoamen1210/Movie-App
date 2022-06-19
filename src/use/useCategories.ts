import { useAxios } from '@/plugins/axios';

export const useCategories = (): any => {

    const { axios } = useAxios();
    const getAll = async () => {
        try {
            let res = await axios.get(`/category`);
            return res.data
        } catch (err) {
            return err
        }
    }

    return {
        getAll
    }
}