import Fields from "@/web-reader/modules/fields/server_components/fields";

const FieldsTabs = () => {
    return (
        <div>
            <Fields searchParams={{ page: "1" }} />
        </div>
    )
}

export default FieldsTabs;