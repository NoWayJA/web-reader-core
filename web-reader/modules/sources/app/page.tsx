import Sources from "@/web-reader/modules/sources/server_components/sources";

const SourcesTabs = () => {
    return (
        <div>
            <Sources searchParams={{ page: "1" }} />
        </div>
    )
}

export default SourcesTabs;