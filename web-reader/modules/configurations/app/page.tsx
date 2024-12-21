import Configurations from "@/web-reader/modules/configurations/server_components/configurations";

const FieldsTabs = () => {
    return (
        <div>
            <Configurations searchParams={{ page: "1" }} />
        </div>
    )
}

export default FieldsTabs;