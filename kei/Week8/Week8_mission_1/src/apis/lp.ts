import type { PagiNationDto } from "../types/common.ts";
import type { Lp, ResponseLpListDto, UpdateOrCreateLpDto } from "../types/lp.ts";
import { axiosInstance } from "./axios.ts";

export const getLpList = async (
    paginationDto: PagiNationDto
): Promise<ResponseLpListDto> => {
    const { data } = await axiosInstance.get('/v1/lps', {
        params:paginationDto,
    });

    return data as ResponseLpListDto;
};

export const getLpById = async (id: string): Promise<Lp> => {
    const { data } = await axiosInstance.get(`/v1/lps/${id}`);

    return data.data as Lp;
}

export async function patchLp (lpId: number, body: UpdateOrCreateLpDto) {
    const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, body);

    return data.data;
}

export const deleteLp = async (lpId: number) => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
    
    return data;
}

export const createLp = async (body: UpdateOrCreateLpDto) => {
    const { data } = await axiosInstance.post('/v1/lps', body);

    return data.data as Lp;
}

export const postLpLike = async (lpId: number) => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
    
    return data.data;
}

export const deleteLpLike = async (lpId: number) => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);

    return data.data;
}