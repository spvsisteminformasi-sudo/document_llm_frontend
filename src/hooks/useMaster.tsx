import { useEffect, useState } from "react";
import { ListRequest, ListResponse, useAxios } from "./useAxios";
import type { RoleType } from "@/entities/role";
import type { UserType } from "@/entities/user";
import type { TagType } from "@/entities/tag";

export const useMaster = () => {
    const [user, setUser] = useState<UserType[]>([])
    const [tag, setTag] = useState<TagType[]>([])


    const {
        isLoading: isLoadingUser,
        statusCode: statusCodeUser,
        data: dataUser,
        fetch: fetchUser,
    } = useAxios<ListResponse<UserType>, ListRequest>({
        url: '/api/user',
    })

    useEffect(() => {
        if (isLoadingUser && statusCodeUser === null) {
            return
        }
        if (statusCodeUser === 200 && dataUser?.data) {
            setUser(dataUser.data)
        }
    }, [isLoadingUser, statusCodeUser, dataUser])

    const {
        isLoading: isLoadingTag,
        statusCode: statusCodeTag,
        data: dataTag,
        fetch: fetchTag,
    } = useAxios<ListResponse<TagType>, ListRequest>({
        url: '/api/tags?full=true',
    })

    useEffect(() => {
        if (isLoadingTag && statusCodeTag === null) {
            return
        }
        if (statusCodeTag === 200 && dataTag?.data) {
            setTag(dataTag.data)
        }
    }, [isLoadingTag, statusCodeTag, dataTag])

    return {
        user,
        fetchUser,
        tag,
        fetchTag,
    };
}
