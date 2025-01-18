import Entries from "@/web-reader/modules/entries/server_components/entries";

const EntriesTabs = () => {
    return (
        <div>
            <Entries searchParams={{ page: "1" }} />
        </div>
    )
}

export default EntriesTabs;