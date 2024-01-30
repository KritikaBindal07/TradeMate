import React from 'react';
import jsPDF from 'jspdf';

const DownloadPDFComponent = ({ customerEntries }) => {
  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.text('Customer Transactions', 20, 10);

    customerEntries.forEach((entry, index) => {
      pdf.text(`Date: ${entry.date}`, 20, 20 + index * 10);
      pdf.text(`You Got: ${entry.youGot}`, 20, 30 + index * 10);
      pdf.text(`You Gave: ${entry.youGave}`, 20, 40 + index * 10);
      // Add more details if needed
    });

    pdf.save('customer_transactions.pdf');
  };

  return (
    <div>
      
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
};

export default DownloadPDFComponent;
