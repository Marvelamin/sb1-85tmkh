import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Download } from 'lucide-react';
import { ExcelData, ExcelProcessorProps } from '../types';

const ExcelProcessor: React.FC<ExcelProcessorProps> = ({ mainExcel, setMainExcel }) => {
  const [newExcel, setNewExcel] = useState<ExcelData[]>([]);

  const handleNewExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelData[];
        setNewExcel(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const mergeExcelFiles = () => {
    const mergedData = [...mainExcel, ...newExcel];
    setMainExcel(mergedData);
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(mergedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Merged Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'merged_excel.xlsx';
    link.click();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Yeni Excel Dosyası Ekle</h2>
      <div className="mb-6">
        <label htmlFor="newExcel" className="block text-sm font-medium text-gray-700 mb-2">
          Yeni Excel Dosyası Yükle
        </label>
        <div className="flex items-center justify-center w-full">
          <label htmlFor="newExcel" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Yüklemek için tıklayın</span> veya sürükleyip bırakın</p>
              <p className="text-xs text-gray-500">XLSX, XLS</p>
            </div>
            <input id="newExcel" type="file" className="hidden" onChange={handleNewExcelUpload} accept=".xlsx,.xls" />
          </label>
        </div>
      </div>
      <button
        onClick={mergeExcelFiles}
        disabled={newExcel.length === 0}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        <div className="flex items-center justify-center">
          <Download className="w-5 h-5 mr-2" />
          Birleştir ve İndir
        </div>
      </button>
      
      {newExcel.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Yüklenen Excel Verisi</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(newExcel[0]).map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {newExcel.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td
                        key={i}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {value?.toString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelProcessor;