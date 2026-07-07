import { FilterOptionsState } from '@mui/material'
import moment from 'moment'
import { CSSProperties } from 'react'
import {
    Control,
    FieldValues,
    RegisterOptions,
} from 'react-hook-form'
import dayjs from 'dayjs'
import 'moment/locale/id';

export interface Option {
    key: string
    value: string
}

export interface FormInputProps {
    type?: FormInputType
    name: string
    label?: string
    image?: string
    placeholder?: string
    options?: any[]
    value?: any
    checked?: boolean
    error?: any
    labelSize?: number
    onChange?: (value: string) => void
    onSelect?: (value: any) => void
    onChangeChecked?: (checked: boolean) => void
    onChangeValues?: (values: string[]) => void
    onInputChange?: (value: string) => void
    values?: string[]
    disabled: boolean
    picker?: string
    size?: 'small' | 'medium'
    style?: CSSProperties
    multiple?: boolean
    mask?: (string | RegExp)[]
    variant?: 'standard' | 'filled' | 'outlined'
    align?: string
    rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'
    >
    | undefined
    control?: Control<any> | undefined
    optionLabel?: (option: any) => string
    optionRadioGroupLabel?: (option: any) => any
    groupBy?: (option: any) => string
    labelShrink?: boolean
    isOptionEqualToValue?: (option: any, value: any) => boolean
    freeSolo?: boolean
    filterOptions?: ((options: any[], state: FilterOptionsState<any>) => any[]) | undefined
    minDate?: dayjs.Dayjs
    maxDate?: dayjs.Dayjs
    rows?: number;
}

export class MaskType {
    static NPWP: (string | RegExp)[] = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, '-', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/]
}

export enum FormInputType {
    TextArea,
    Input,
    InputMask,
    AutoComplete,
    Select,
    Multiple,
    DateRangePicker,
    DatePicker,
    Switch,
    Checkbox,
    Radio,
    RadioGroup,
    Number,
    Password,
    File,
}

interface PydanticError {
    loc: string[]
    msg: string
    type: string
    input?: any
    url?: string
}

export const assignError = (setError: any, errors: PydanticError[]) => {
    if (errors) {
        errors.forEach((error) => {
            const fieldName = error.loc[0].toLowerCase()
            console.log(fieldName)
            console.log(error.msg)
            setError(fieldName, { type: 'manual', message: error.msg })
        })
    }
}

export const trimAll = (o: any) => {
    for (const [k, v] of Object.entries(o)) {
        if (Object(v) === v)
            trimAll(v)
        else if (typeof v === 'string')
            o[k] = v.trim();
    }
    return o;
}

export const periode = () => {
    var localLocale = moment().locale('id');
    const current = localLocale.format('YYYYMM')
    const next = localLocale.add(1, 'months').format('YYYYMM')
    return [current, next];
}

export const periodeAll = () => {
    var localLocale = moment().locale('id');
    let current = moment('2024-01-01').locale('id')
    const dates = [current.format('YYYYMM')];
    do {
        current = moment(current).add(1, 'months')
        dates.push(current.format('YYYYMM'));
    } while (moment(current).isBefore(localLocale));
    return dates;
}
