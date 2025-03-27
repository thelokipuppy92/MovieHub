import DataTable, { TableColumn } from 'react-data-table-component';
import Director from '../model/director.model';

interface DirectorTableProps {
    data: Director[];
    loading: boolean;
    isError: boolean;
    onRowSelected: (state: { selectedRows: Director[] }) => void;
    theme: 'light' | 'dark';
}

function DirectorTable({ data, loading, isError, onRowSelected, theme }: DirectorTableProps) {
    const columns: TableColumn<Director>[] = [
        { name: 'ID', selector: (row: Director) => row.id.toString(), sortable: true },
        { name: 'Name', selector: (row: Director) => row.name, sortable: true },
        {
            name: 'Email',
            selector: (row: Director) => row.email ? row.email : 'No email',
            sortable: true,
        },
        {
            name: 'Age',
            selector: (row: Director) => row.age !== undefined && row.age !== null ? row.age.toString() : 'N/A',
            sortable: true,
        },
    ];

    return (
        <>
            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : isError ? (
                <p className="error-text">An error occurred while fetching data</p>
            ) : (
                <div className="table-container">
                    <DataTable
                        title="Directors"
                        columns={columns}
                        data={data}
                        pagination
                        highlightOnHover
                        selectableRows
                        onSelectedRowsChange={onRowSelected}
                        theme={theme === "dark" ? "dark" : "default"}
                    />
                </div>
            )}
        </>
    );
}

export default DirectorTable;