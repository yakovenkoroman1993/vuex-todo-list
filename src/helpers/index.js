export function vuexify(path, mutation) {
    let [source, state] = path.split('/');
    return {
        [state]: {
            get() {
                return this.$store.state[source][state];
            },
            set(value) {
                this.$store.commit(`${source}/${mutation}`, {
                    [state]: value
                })
            }
        },
    };
}