import jsPDF from 'jspdf';
import { EventPlan } from '@/types/event';

// Helper to convert hex to RGB
function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return [r, g, b];
  }
  const num = parseInt(cleanHex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function exportEventPlanToPdf(plan: EventPlan) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      drawFooter();
    }
  };

  const drawFooter = () => {
    const totalPages = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 150);
      doc.text(
        `PlanVibe AI Event Brief — ${plan.eventOverview.title} • Page ${i} of ${totalPages}`,
        margin,
        pageHeight - 8
      );
    }
  };

  // --- Title & Header Banner ---
  doc.setFillColor(30, 27, 75); // Indigo 950
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(plan.eventOverview.title.substring(0, 48), margin + 8, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(224, 231, 255);
  const subtitle = `${plan.inputs.eventType} • ${plan.inputs.guestCount} Guests • ${plan.inputs.location || 'Location TBA'} • Date: ${plan.inputs.eventDate || 'Flexible'}`;
  doc.text(subtitle, margin + 8, y + 20);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(251, 191, 36); // Amber accent
  const budgetStr = `Total Budget: ${plan.budgetBreakdown.currency} ${plan.budgetBreakdown.totalBudget.toLocaleString()}`;
  doc.text(budgetStr, margin + 8, y + 28);

  y += 42;

  // --- Theme & Summary ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('Theme Concept & Creative Direction', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const themeLines = doc.splitTextToSize(plan.eventOverview.themeConcept, contentWidth);
  doc.text(themeLines, margin, y);
  y += themeLines.length * 4.5 + 4;

  const summaryLines = doc.splitTextToSize(plan.eventOverview.summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.5 + 4;

  // --- Color Palette Swatches ---
  if (plan.eventOverview.suggestedColorPalette?.length) {
    checkPageBreak(18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text('Curated Color Palette:', margin, y);
    y += 5;

    let swatchX = margin;
    plan.eventOverview.suggestedColorPalette.forEach((hex) => {
      try {
        const [r, g, b] = hexToRgb(hex);
        doc.setFillColor(r, g, b);
        doc.roundedRect(swatchX, y, 16, 8, 1, 1, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.roundedRect(swatchX, y, 16, 8, 1, 1, 'D');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(hex.toUpperCase(), swatchX, y + 12);
        swatchX += 24;
      } catch {
        // skip if invalid hex
      }
    });
    y += 18;
  }

  // --- Budget Breakdown Table ---
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text('Interactive Budget Breakdown', margin, y);
  y += 7;

  // Header row
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Category', margin + 3, y + 5);
  doc.text('Allocated Amount', margin + 65, y + 5);
  doc.text('% Share', margin + 105, y + 5);
  doc.text('Cost-Saving Strategies', margin + 125, y + 5);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  plan.budgetBreakdown.categories.forEach((cat) => {
    checkPageBreak(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(cat.category, margin + 3, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.text(`${plan.budgetBreakdown.currency} ${cat.allocatedAmount.toLocaleString()}`, margin + 65, y + 4);
    doc.text(`${cat.percentage}%`, margin + 105, y + 4);

    doc.setTextColor(71, 85, 105);
    const tipLines = doc.splitTextToSize(cat.tipsToSave || '—', contentWidth - 128);
    doc.text(tipLines, margin + 125, y + 4);

    const rowHeight = Math.max(7, tipLines.length * 3.8 + 3);
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);
    y += rowHeight;
  });

  y += 6;

  // --- Chronological Timelines ---
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text('Chronological Timeline & Key Milestones', margin, y);
  y += 7;

  plan.timeline.forEach((milestone) => {
    checkPageBreak(18 + (milestone.tasks?.length || 0) * 5);
    doc.setFillColor(238, 242, 255); // Indigo 50
    doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(67, 56, 202);
    doc.text(milestone.timeframe, margin + 4, y + 5);
    y += 9;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);

    milestone.tasks.forEach((task) => {
      checkPageBreak(8);
      const isDone = milestone.completedTasks?.includes(task);
      const bullet = isDone ? '[X] ' : '[ ] ';
      const taskLines = doc.splitTextToSize(bullet + task, contentWidth - 8);
      doc.text(taskLines, margin + 4, y + 3.5);
      y += taskLines.length * 4 + 1;
    });
    y += 3;
  });

  y += 5;

  // --- Dynamic Vendor Checklist ---
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text('Vendor Checklist & Critical Questions', margin, y);
  y += 7;

  plan.vendorChecklist.forEach((v) => {
    checkPageBreak(20 + (v.questionsToAsk?.length || 0) * 4);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);

    let priorityColor = [16, 185, 129]; // Low: green
    if (v.priority === 'High') priorityColor = [225, 29, 72]; // Rose
    if (v.priority === 'Medium') priorityColor = [245, 158, 11]; // Amber

    doc.text(v.vendorType, margin, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
    doc.text(`[${v.priority} Priority]`, margin + 65, y + 4);

    doc.setTextColor(100, 116, 139);
    doc.text(`Est. Cost: ${v.estimatedCost}`, margin + 110, y + 4);
    y += 7;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    v.questionsToAsk.slice(0, 3).forEach((q) => {
      checkPageBreak(6);
      const qLines = doc.splitTextToSize(`• ${q}`, contentWidth - 10);
      doc.text(qLines, margin + 4, y + 3);
      y += qLines.length * 3.5;
    });
    y += 4;
  });

  // --- Personalized Ideas ---
  if (plan.personalizedIdeas?.length) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text('Curated Themes, Decor & Activities', margin, y);
    y += 7;

    plan.personalizedIdeas.forEach((idea) => {
      checkPageBreak(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(67, 56, 202);
      doc.text(`[${idea.category}] ${idea.title}`, margin, y + 3.5);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const ideaDesc = doc.splitTextToSize(idea.description, contentWidth);
      doc.text(ideaDesc, margin, y + 3);
      y += ideaDesc.length * 3.8 + 4;
    });
  }

  // Draw footer on all pages
  drawFooter();

  // Save the PDF
  const cleanTitle = plan.eventOverview.title.replace(/[^a-zA-Z0-9-_]/g, '_');
  doc.save(`${cleanTitle}_Event_Plan.pdf`);
}
