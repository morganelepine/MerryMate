// role="alert": the message is read out as soon as it appears, not only shown in red.
// Give it an `id` and point the field's aria-describedby at it to tie them together.
export default function InputError({ message, className = "", ...props }) {
    return message ? (
        <p
            role="alert"
            {...props}
            className={"text-sm text-orange-500 " + className}
        >
            {message}
        </p>
    ) : null;
}
