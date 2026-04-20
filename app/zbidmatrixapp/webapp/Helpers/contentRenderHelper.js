sap.ui.define([], () => {
    "use strict";
    return {
        renderSheet(oController, sheetName) 
        {
            const ws = oController.workbook.Sheets[sheetName];
            const table = document.getElementById("excelTable");
            if (!ws)
            {
                table.innerHTML = "<tr><td>Empty sheet</td></tr>"; return;
            }
            const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
            const rows  = range.e.r - range.s.r + 1;
            const cols  = range.e.c - range.s.c + 1;
            const colWidths = ws['!cols'] || [];
            const rowHeights = ws['!rows'] || [];
            const merges = ws['!merges'] || [];
            const mergeMap = {};
            const mergeSkip = new Set();
            merges.forEach(m => {
                mergeMap[`${m.s.r},${m.s.c}`] = m;
                for (let r = m.s.r; r <= m.e.r; r++)
                {
                    for (let c = m.s.c; c <= m.e.c; c++)
                    {
                        if (r !== m.s.r || c !== m.s.c)
                        {
                            mergeSkip.add(`${r},${c}`);
                        }
                    }
                }
            });

            let html = '<colgroup><col style="width:42px"/>';
            for (let c = range.s.c; c <= range.e.c; c++)
            {
                const wch = colWidths[c] && colWidths[c].wch
                    ? Math.round(colWidths[c].wch * 7) + "px"
                    : "80px";
                html += `<col style="width:${wch}"/>`;
            }
            html += "</colgroup>";
            html += '<tr class="col-header"><td class="row-num"></td>';
            for (let c = range.s.c; c <= range.e.c; c++)
            {
                html += `<td>${XLSX.utils.encode_col(c)}</td>`;
            }
            html += "</tr>";
            for (let r = range.s.r; r <= range.e.r; r++)
            {
                const rowH = rowHeights[r] && rowHeights[r].hpt
                    ? `height:${Math.round(rowHeights[r].hpt * 1.33)}px;`
                    : "height:22px;";
                html += `<tr style="${rowH}">`;
                html += `<td class="row-num">${r + 1}</td>`;
                for (let c = range.s.c; c <= range.e.c; c++)
                {
                    const key = `${r},${c}`;
                    if (mergeSkip.has(key))
                    {
                        continue;
                    }
                    let spanAttrs = "";
                    if (mergeMap[key])
                    {
                        const m = mergeMap[key];
                        const rs = m.e.r - m.s.r + 1;
                        const cs = m.e.c - m.s.c + 1;
                        if (rs > 1) spanAttrs += ` rowspan="${rs}"`;
                        if (cs > 1) spanAttrs += ` colspan="${cs}"`;
                    }
                    const cellAddr = XLSX.utils.encode_cell({ r, c });
                    const cell     = ws[cellAddr];
                    let displayVal = "";
                    if (cell)
                    {
                        displayVal = cell.w !== undefined
                            ? cell.w
                            : (cell.v !== undefined ? String(cell.v) : "");
                    }
                    let style = "";
                    if (cell && cell.s) {
                        const s = cell.s;
                        if (s.fgColor && s.fgColor.rgb && s.fgColor.rgb !== "FFFFFF00")
                        {
                            style += `background-color:#${s.fgColor.rgb};`;
                        }
                        if (s.bgColor && s.bgColor.rgb && s.bgColor.rgb !== "FFFFFF00")
                        {
                            style += `background-color:#${s.bgColor.rgb};`;
                        }
                        if (s.font)
                        {
                            if (s.font.bold) style += "font-weight:bold;";
                            if (s.font.italic) style += "font-style:italic;";
                            if (s.font.underline) style += "text-decoration:underline;";
                            if (s.font.strike) style += "text-decoration:line-through;";
                            if (s.font.sz) style += `font-size:${Math.round(s.font.sz * 0.75)}px;`;
                            if (s.font.color && s.font.color.rgb)
                            {
                                style += `color:#${s.font.color.rgb};`;
                            }
                            if (s.font.name)
                            {
                                style += `font-family:'${s.font.name}', Calibri, Arial, sans-serif;`;
                            }
                        }
                        if (s.alignment)
                        {
                            if (s.alignment.horizontal)
                            {
                                const hMap = {
                                    center: "center",
                                    right: "right",
                                    left: "left",
                                    fill: "left",
                                    justify:"justify"
                                };
                                style += `text-align:${hMap[s.alignment.horizontal] || "left"};`;
                            }
                            if (s.alignment.vertical)
                            {
                                const vMap = {
                                    top:    "top",
                                    center: "middle",
                                    bottom: "bottom"
                                };
                                style += `vertical-align:${vMap[s.alignment.vertical] || "middle"};`;
                            }
                            if (s.alignment.wrapText)
                            {
                                style += "white-space:normal;";
                            }
                        }
                        if (s.border)
                        {
                            const bStyle = (b) => {
                                if (!b || !b.style) return "1px solid #d0d0d0";
                                const w = { thin:"1px", medium:"2px", thick:"3px", hair:"1px" };
                                const c = b.color && b.color.rgb ? `#${b.color.rgb}` : "#333";
                                return `${w[b.style] || "1px"} solid ${c}`;
                            };
                            if (s.border.top) style += `border-top:${bStyle(s.border.top)};`;
                            if (s.border.bottom) style += `border-bottom:${bStyle(s.border.bottom)};`;
                            if (s.border.left) style += `border-left:${bStyle(s.border.left)};`;
                            if (s.border.right) style += `border-right:${bStyle(s.border.right)};`;
                        }
                    }
                    html += `<td${spanAttrs} style="${style}" title="${displayVal}">${displayVal}</td>`;
                }
                html += "</tr>";
            }
            table.innerHTML = html;
            document.getElementById("excelTableContainer").scrollTo(0, 0);
        }
    }
});



