// components/PersonTable.tsx
import DataTable, { TableColumn } from 'react-data-table-component';
import Person from '../model/person.model';

interface PersonTableProps {
    data: Person[];
    loading: boolean;
    isError: boolean;
    onRowSelected: (state: { selectedRows: Person[] }) => void;
    theme: 'light' | 'dark';
}

function PersonTable({ data, loading, isError, onRowSelected, theme }: PersonTableProps) {
    const columns: TableColumn<Person>[] = [
        { name: 'ID', selector: (row: Person) => row.id, sortable: true },
        { name: 'Name', selector: (row: Person) => row.name, sortable: true },
        { name: 'Age', selector: (row: Person) => row.age, sortable: true },
        { name: 'Email', selector: (row: Person) => row.email, sortable: true },
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
                        title="People"
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

export default PersonTable;