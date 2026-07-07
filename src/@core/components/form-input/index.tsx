// ** React Imports

// ** MUI Imports
import { FormInputProps, FormInputType } from './index.type'
import {
    Autocomplete,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem,
    Grid,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    FormLabel,
    Typography,
    OutlinedInput
} from '@mui/material'
import { Controller } from 'react-hook-form'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useState } from 'react'
import MaskedInput from 'react-text-mask'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const FormInput = (props: FormInputProps) => {
    const {
        type = FormInputType.Input,
        name,
        label = '',
        placeholder = 'Input here',
        multiple,
        options,
        labelSize = 12,
        optionLabel,
        isOptionEqualToValue,
        error,
        onSelect,
        onChangeChecked,
        onInputChange,
        optionRadioGroupLabel,
        disabled,
        groupBy,
        rules,
        control,
        mask,
        labelShrink = false,
        freeSolo = false,
        variant = 'standard',
        size = 'small',
        align = 'left',
        filterOptions,
        minDate = null,
        maxDate = null,
        rows = 3
    } = props
    const [showPassword, setShowPassword] = useState(false);

    const onClickShowPassword = () => setShowPassword((show) => !show);

    const renderError = () => {
        if (error) {
            return error?.message ? error?.message : 'This field is required'
        } else {
            return ''
        }
    }
    const renderInput = (
        <FormControl fullWidth>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { value, onChange } }) => (
                    <TextField
                        InputLabelProps={labelShrink ? { shrink: labelShrink } : {}}
                        value={value ?? ''}
                        label={label}
                        disabled={disabled}
                        onChange={(val: any) => {
                            onChange(val)
                            if (onInputChange) {
                                onInputChange!(val.target.value)
                            }
                        }}
                        placeholder={placeholder}
                        variant={variant}
                        size={size}
                        sx={{
                            input: {
                                textAlign: align,
                            },
                        }}
                        error={Boolean(error)}
                        id={`textinput-${name.replaceAll('.', '_')}`}
                        helperText={renderError()}
                        aria-describedby={`validation-${name.replaceAll('.', '_')}`}
                    />
                )}
            />
        </FormControl>
    )
    const renderInputNumber = (
        <FormControl fullWidth>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { value, onChange } }) => (
                    <TextField
                        InputLabelProps={labelShrink ? { shrink: labelShrink } : {}}
                        value={value ?? ''}
                        label={label}
                        type='number'
                        disabled={disabled}
                        onChange={onChange}
                        placeholder={placeholder}
                        variant={variant}
                        size={size}
                        error={Boolean(error)}
                        id={`textinput-${name.replaceAll('.', '_')}`}
                        helperText={renderError()}
                        aria-describedby={`validation-${name.replaceAll('.', '_')}`}
                        autoComplete='off'
                        sx={{
                            input: {
                                textAlign: align,
                            },
                        }}
                    />
                )}
            />
        </FormControl>
    )
    const renderDatePicker = (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormControl fullWidth>
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field: { value, onChange } }) => (
                        <DatePicker
                            label={label}
                            value={value ? dayjs(value) : null}
                            onChange={(date) => {
                                if (date) {
                                    onChange(dayjs(date).format('YYYY-MM-DD'))
                                    if (onInputChange) {
                                        onInputChange(dayjs(date).format('YYYY-MM-DD'))
                                    }
                                }
                            }}
                            format="DD-MM-YYYY"
                            disabled={disabled}
                            minDate={minDate!}
                            maxDate={maxDate!}
                            slotProps={{
                                textField: {
                                    id: `datepicker-${name.replaceAll('.', '_')}`,
                                    name: name,
                                    size: 'small',
                                    fullWidth: true,
                                    variant: 'standard',
                                }
                            }}
                        />
                    )}
                />
                {error && (
                    <FormHelperText error={true}>
                        {renderError()}
                    </FormHelperText>
                )}
            </FormControl>
        </LocalizationProvider>
    )

    const renderDatePickerRange = (
        <FormControl fullWidth>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { value, onChange } }) => (
                    <DatePicker
                        label={label}
                        value={dayjs(value)}
                        onChange={(date) => onChange(date ? dayjs(date).format('YYYY-MM-DD') : undefined)}
                        format="DD-MM-YYYY"
                        disabled={disabled}
                        slotProps={{
                            textField: {
                                id: `datepickerrange-${name.replaceAll('.', '_')}`,
                                name: name,
                                size: 'small',
                                fullWidth: true,
                                variant: 'standard',
                            }
                        }}
                    />
                )}
            />
            {error && (
                <FormHelperText error={true}>
                    {renderError()}
                </FormHelperText>
            )}
        </FormControl>
    )
    const renderInputMask = (
        <FormControl fullWidth>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { value, onChange } }) => (
                    <MaskedInput
                        mask={mask!}
                        guide={false}
                        id={`textinput-${name.replaceAll('.', '_')}`}
                        value={value ?? ''}
                        onChange={onChange}
                        keepCharPositions
                        render={(ref: any, props: any) => (
                            <TextField
                                inputRef={ref}
                                {...props}
                                label={label}
                                disabled={disabled}
                                placeholder={placeholder}
                                variant={variant}
                                size={size}
                                error={Boolean(error)}
                                helperText={renderError()}
                                aria-describedby={`validation-${name.replaceAll('.', '_')}`}
                            />
                        )}
                    />
                )}
            />
        </FormControl>
    )

    const renderPassword = (
        <FormControl fullWidth variant={variant} error={Boolean(error)}>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { value, onChange } }) => (
                    <>
                        <InputLabel htmlFor={`standard-${name.replaceAll('.', '_')}`}>{label}</InputLabel>
                        {variant === 'outlined' ? (
                            <OutlinedInput
                                type={showPassword ? 'text' : 'password'}
                                value={value ?? ''}
                                disabled={disabled}
                                onChange={onChange}
                                placeholder={placeholder}
                                size={size}
                                id={`textinput-${name.replaceAll('.', '_')}`}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={onClickShowPassword}
                                            onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                                                event.preventDefault();
                                            }}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />) : (
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                value={value ?? ''}
                                disabled={disabled}
                                onChange={onChange}
                                placeholder={placeholder}
                                size={size}
                                id={`textinput-${name.replaceAll('.', '_')}`}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={onClickShowPassword}
                                            onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                                                event.preventDefault();
                                            }}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />)}

                    </>
                )}
            />
            {error && (
                <FormHelperText error={true}>
                    {renderError()}
                </FormHelperText>
            )}
        </FormControl>
    )

    const renderCheckbox = (
        <FormControl fullWidth>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={value ? true : false}
                                value={value}
                                id={`checkbox-${name.replaceAll('.', '_')}`}
                                onChange={event => {
                                    onChangeChecked!(event.target.checked)
                                    onChange(event)
                                }}
                            />
                        }
                        label={label}
                    />
                )}
            />
            {error && (
                <FormHelperText error={true}>
                    {renderError()}
                </FormHelperText>
            )}
        </FormControl>
    )

    const renderRadio = (
        <FormControl fullWidth>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                        control={
                            <Radio
                                checked={value}
                                value={value}
                                onChange={event => {
                                    onChangeChecked!(event.target.checked)
                                    onChange(event)
                                }}
                            />
                        }
                        label={label}
                    />
                )}
            />
            {error && (
                <FormHelperText error={true}>
                    {renderError()}
                </FormHelperText>
            )}
        </FormControl>
    )

    const renderLabelRadio = (data: any[]) => {
        const labels = optionRadioGroupLabel ? data?.map(optionRadioGroupLabel) : data
        return (
            <>
                <Grid container spacing={2}>
                    {labels?.map(r => (
                        <Grid key={r.value} size={4}>
                            <FormControlLabel
                                value={r.value}
                                id={`radio-${name.replaceAll('.', '_')}-${r.value}`}
                                control={<Radio />}
                                label={
                                    <Typography sx={{ fontSize: labelSize }}>
                                        {r.title}
                                    </Typography>
                                }
                            />
                        </Grid>
                    ))}
                </Grid>
            </>
        )
    }

    const renderRadioGroupLabel = () => {
        if (groupBy) {
            const groups = options?.reduce((r, a) => {
                const key = groupBy(a)
                r[key] = r[key] || [];
                r[key].push(a);
                return r;
            }, []);
            return (
                <>
                    {Object.keys(groups)?.map(key => (
                        <>
                            <Stack direction="column" gap={1}>
                                <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                                    {key.toUpperCase()}
                                </Typography>
                                {renderLabelRadio(groups[key])}
                            </Stack>
                        </>
                    )
                    )}

                </>
            )
        } else {
            return renderLabelRadio(options!)
        }
    }

    const renderRadioGroup = (
        <FormControl fullWidth>
            {label && <FormLabel sx={{ fontSize: 12 }} id={`radio-${name.replaceAll('.', '_')}`}>{label}</FormLabel>}
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { value, onChange } }) => (
                    <RadioGroup
                        aria-labelledby={label && `radio-${name.replaceAll('.', '_')}`}
                        name={name}
                        value={`${value}`}
                        onChange={event => {
                            const checked = (event.target as HTMLInputElement).value;
                            onChange(checked)
                            if (onInputChange) onInputChange!(checked)
                        }}>
                        {renderRadioGroupLabel()}
                    </RadioGroup>

                )}
            />
            {error && (
                <FormHelperText error={true}>
                    {renderError()}
                </FormHelperText>
            )}
        </FormControl>
    )

    const renderTextArea = (
        <FormControl fullWidth>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { value, onChange } }) => (
                    <TextField
                        value={value ?? ''}
                        label={label}
                        disabled={disabled}
                        onChange={onChange}
                        multiline
                        rows={rows}
                        placeholder={placeholder}
                        variant={variant}
                        size={size}
                        id={`textinput-${name.replaceAll('.', '_')}`}
                        error={Boolean(error)}
                        helperText={renderError()}
                        aria-describedby="validation-basic-first-name"
                    />
                )}
            />
        </FormControl>
    )

    const renderAutoComplete = (
        <FormControl fullWidth>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { value, onChange } }) => (
                    <Autocomplete
                        options={options!}
                        onChange={(e, data) => {
                            onChange(data)
                            if (onSelect) {
                                onSelect!(data)
                            }
                        }}
                        autoHighlight
                        value={multiple ? value || [] : value || ''}
                        disabled={disabled}
                        defaultValue={multiple ? value || [] : value || ''}
                        isOptionEqualToValue={isOptionEqualToValue}
                        getOptionLabel={optionLabel}
                        multiple={multiple}
                        groupBy={groupBy}
                        freeSolo={freeSolo}
                        filterOptions={filterOptions}
                        id={`selectinput-${name.replaceAll('.', '_')}`}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={`${label}`}
                                variant={variant}
                                onChange={e => {
                                    if (onInputChange) onInputChange!(e.currentTarget.value)
                                }}
                                fullWidth
                                placeholder={placeholder}
                                error={Boolean(error)}
                                helperText={renderError()}
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'off', // disable autocomplete and autofill
                                }}
                            />
                        )}
                    />
                )}
            />
        </FormControl>
    )

    const renderMultiple = (
        <FormControl fullWidth>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { value, onChange } }) => (
                    <Select
                        onChange={(e, data) => onChange(data)}
                        value={multiple ? value || [] : value || ''}
                        disabled={disabled}
                        defaultValue={multiple ? value || [] : value || ''}
                        multiple={multiple}
                        id={`selectinput-${name.replaceAll('.', '_')}`}
                        input={
                            <TextField
                                label={`${label}`}
                                variant={variant}
                                onChange={e => {
                                    if (onInputChange) onInputChange!(e.currentTarget.value)
                                }}
                                fullWidth
                                error={Boolean(error)}
                                helperText={renderError()}
                                inputProps={{
                                    autoComplete: 'off',
                                }}
                            />
                        }
                    >
                        {options!.map((value) => (
                            <MenuItem
                                key={value}
                                value={optionLabel!(value)}
                            >
                                {optionLabel!(value)}
                            </MenuItem>
                        ))}
                    </Select>
                )}
            />
        </FormControl>
    )

    const renderSelect = (
        <FormControl fullWidth variant={variant}>
            {label && <InputLabel id={`selectlabel-${name.replaceAll('.', '_')}`}>{label}</InputLabel>}
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { value, onChange } }) => (
                    <Select
                        onChange={(e, data) => {
                            onChange(e, data)
                            if (onSelect) {
                                onSelect!(data)
                            }
                        }}
                        label={`${label}`}
                        variant={variant}
                        value={multiple ? value || [] : value || ''}
                        disabled={disabled}
                        defaultValue={multiple ? value || [] : value || ''}
                        multiple={multiple}
                        id={`selectinput-${name.replaceAll('.', '_')}`}
                    >
                        {options!.map((value) => (
                            <MenuItem
                                key={value}
                                value={value}
                            >
                                {optionLabel!(value)}
                            </MenuItem>
                        ))}
                    </Select>
                )}
            />
        </FormControl>
    )

    const renderFile = (
        <FormControl fullWidth>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { value, onChange } }) => (
                    <TextField
                        InputLabelProps={labelShrink ? { shrink: labelShrink } : {}}
                        label={label}
                        type='file'
                        disabled={disabled}
                        onChange={onChange}

                        placeholder={placeholder}
                        variant={variant}
                        size={size}
                        error={Boolean(error)}
                        id={`textinput-${name.replaceAll('.', '_')}`}
                        helperText={renderError()}
                        autoComplete='off'
                    />
                )}
            />
        </FormControl>
    )

    const renderForm = () => {
        switch (type) {
            case FormInputType.TextArea:
                return renderTextArea
            case FormInputType.InputMask:
                return renderInputMask
            case FormInputType.Number:
                return renderInputNumber
            case FormInputType.AutoComplete:
                return renderAutoComplete
            case FormInputType.Select:
                return renderSelect
            case FormInputType.DateRangePicker:
                return renderDatePickerRange
            case FormInputType.DatePicker:
                return renderDatePicker
            case FormInputType.Checkbox:
                return renderCheckbox
            case FormInputType.Multiple:
                return renderMultiple
            case FormInputType.Password:
                return renderPassword
            case FormInputType.Radio:
                return renderRadio
            case FormInputType.RadioGroup:
                return renderRadioGroup
            case FormInputType.File:
                return renderFile
            default:
                return renderInput
        }
    }
    return <>{renderForm()}</>
}

export default FormInput
