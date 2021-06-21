export default function expose(label, value) {
    if(value === undefined) {
        value = label;
        label = 'exposed';
    }

    console.log("Exposing to global scope as window." + label + " =");
    console.log(value);

    window[label] = value;
}