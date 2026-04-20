
import fs from 'fs';

const filePath = 'e:/tttn/app/src/app/admin/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Row 1 (PENDING)
content = content.replace(
    /<div className="text-muted small">\{customer\.contact\}<\/div>\s+<\/td>\s+<td className="text-danger fw-bold">/g,
    '<div className="text-muted small">{customer.contact}</div>\n                                          </td>\n                                          <td><div className="small text-truncate" style={{maxWidth: \'200px\'}} title={s.shippingAddress || ""}>{s.shippingAddress || "N/A"}</div></td>\n                                          <td className="text-danger fw-bold">'
);

// Row 2 & 3 (PAID & DELIVERED)
content = content.replace(
    /<div className="text-muted small">\{customer\.contact\}<\/div>\s+<\/td>\s+<td className="text-primary fw-bold">/g,
    '<div className="text-muted small">{customer.contact}</div>\n                                        </td>\n                                        <td className="text-center"><small className="text-muted">{s.shippingAddress || "N/A"}</small></td>\n                                        <td className="text-primary fw-bold">'
);

fs.writeFileSync(filePath, content);
console.log("Successfully updated admin page rows.");
