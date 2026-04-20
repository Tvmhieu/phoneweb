
import sys

file_path = r'e:\tttn\app\src\app\admin\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Row 1 (PENDING)
content = content.replace(
    '<div className="text-muted small">{customer.contact}</div>\n                                          </td>\n                                          <td className="text-danger fw-bold">',
    '<div className="text-muted small">{customer.contact}</div>\n                                          </td>\n                                          <td><div className="small text-truncate" style={{maxWidth: \'200px\'}} title={s.shippingAddress || ""}>{s.shippingAddress || "N/A"}</div></td>\n                                          <td className="text-danger fw-bold">'
)

# Row 2 (PAID)
content = content.replace(
    '<div className="text-muted small">{customer.contact}</div>\n                                        </td>\n                                        <td className="text-primary fw-bold">',
    '<div className="text-muted small">{customer.contact}</div>\n                                        </td>\n                                        <td><div className="small text-truncate" style={{maxWidth: \'200px\'}} title={s.shippingAddress || ""}>{s.shippingAddress || "N/A"}</div></td>\n                                        <td className="text-primary fw-bold">'
)

# Row 3 (DELIVERED)
content = content.replace(
    '<div className="text-muted small">{customer.contact}</div>\n                                        </td>\n                                        <td className="text-primary fw-bold">', # Same as above
    '<div className="text-muted small">{customer.contact}</div>\n                                        </td>\n                                        <td className="text-center"><small className="text-muted">{s.shippingAddress || "N/A"}</small></td>\n                                        <td className="text-primary fw-bold">'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
