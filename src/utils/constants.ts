

const APP_REGEX = {
    email: () => {
        return new RegExp('^([0-9]|[A-Z]|[a-z]|[$-_\.])+@([0-9]|[A-Z]|[a-z]|[_-])+\.([0-9]|[A-Z]|[a-z]|[_\.])+$')
    },
    numberMinMax: (min: number, max: number) => {
        return new RegExp(`^[0-9]{${min},${max}}$`);
    },
    number: () => {
        return new RegExp('^[0-9]*$');
    }
}

export default APP_REGEX