import { useCallback } from 'react';

export function useSavePDF(printAreaId, filename) {
  const handleSave = useCallback(async () => {
    const { default: html2canvas } = await import('html2canvas');
    const { default: jsPDF } = await import('jspdf');

    const element = document.getElementById(printAreaId);
    if (!element) return;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth  = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const A4_PX = 794;

    const pageEls = element.querySelectorAll(':scope > div');
    const targets = pageEls.length > 0 ? Array.from(pageEls) : [element];

    for (let i = 0; i < targets.length; i++) {
      const clone = targets[i].cloneNode(true);

      // ✅ MORE GLOBAL PADDING (main fix)
      clone.style.cssText = `
        width: ${A4_PX}px !important;
        min-width: ${A4_PX}px !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        margin: 0 !important;
        padding: 28px 50px !important; /* ⬅️ augmenté ici */
        background: #ffffff !important;
        box-sizing: border-box !important;
      `;

      // ✅ Add padding to each question block
      clone.querySelectorAll('[data-question="true"]').forEach(q => {
        q.style.paddingLeft = '10px';
      });

      // ✅ Choices (small indent)
      clone.querySelectorAll('[data-choices="true"]').forEach(grid => {
        grid.style.cssText = `
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
          padding-left: 14px !important;
        `;
      });

      // ✅ Grid fix
      clone.querySelectorAll('.grid.grid-cols-2').forEach(grid => {
        grid.style.cssText = `
          display: flex !important;
          flex-direction: column !important;
          gap: 4px !important;
          padding-left: 12px !important;
        `;
      });

      // Visual consistency
      clone.querySelectorAll('*').forEach(el => {
        el.style.borderRadius = el.style.borderRadius || '4px';

        const bg = window.getComputedStyle(el).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)') {
          el.style.backgroundColor = bg;
        }
      });

      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        position: fixed;
        top: -99999px;
        left: -99999px;
        width: ${A4_PX}px;
        background: #ffffff;
        overflow: visible;
      `;

      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      const canvas = await html2canvas(wrapper, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: A4_PX,
        windowWidth: A4_PX,
        scrollX: 0,
        scrollY: 0,
      });

      document.body.removeChild(wrapper);

      const imgData = canvas.toDataURL('image/png');
      const imgHeightMm = (canvas.height / canvas.width) * pdfWidth;

      if (i > 0) pdf.addPage();

      pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        pdfWidth,
        Math.min(imgHeightMm, pdfHeight)
      );
    }

    pdf.save(`${filename}.pdf`);
  }, [printAreaId, filename]);

  return handleSave;
}