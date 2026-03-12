import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setCVData } from '../../../store/cvSlice';
import { PhoneType } from '../../../interfaces/contact_info';
import './cv_editor_form.scss';

const MONTHS = [
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
  { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
];

const YEAR_OPTIONS = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

const CVEditorForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { header, details } = useAppSelector((state) => state.cv);

  const updateCV = (newHeader: typeof header, newDetails: typeof details) => {
    dispatch(setCVData({ header: newHeader, details: newDetails }));
  };

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newHeader = { ...header };

    if (name.startsWith('personal_info.')) {
      const field = name.split('.')[1];
      newHeader.personal_info = {
        ...newHeader.personal_info,
        [field]: value
      };
    } else if (name.startsWith('about_info.')) {
      const field = name.split('.')[1];
      newHeader.about_info = {
        ...newHeader.about_info,
        [field]: value
      };
    }

    updateCV(newHeader, details);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newHeader = { ...header };
    
    if (name === 'email') {
      newHeader.contact_info = {
        ...newHeader.contact_info,
        email: [value]
      };
    } else if (name === 'phone') {
        const newPhoneNumbers = [...newHeader.contact_info.phone_number];
        if (newPhoneNumbers.length > 0) {
            newPhoneNumbers[0] = { ...newPhoneNumbers[0], number: value };
        } else {
            newPhoneNumbers.push({ type: PhoneType.cel, number: value, country_code: '' });
        }
        newHeader.contact_info = {
            ...newHeader.contact_info,
            phone_number: newPhoneNumbers
        };
    }

    updateCV(newHeader, details);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newHeader = { ...header };
    newHeader.contact_info = {
      ...newHeader.contact_info,
      address: {
        ...newHeader.contact_info.address,
        [name]: value
      }
    };
    updateCV(newHeader, details);
  };

  // --- List Handlers ---

  const handleListChange = (section: keyof typeof details, index: number, field: string, value: string | number) => {
    const newDetails = { ...details };
    const list = [...((newDetails[section] as unknown) as Record<string, unknown>[])];
    list[index] = { ...list[index], [field]: value };
    Object.assign(newDetails, { [section]: list });
    updateCV(header, newDetails);
  };

  const addListItem = (section: keyof typeof details, emptyItem: Record<string, unknown>) => {
    const newDetails = { ...details };
    const list = [...((newDetails[section] as unknown) as Record<string, unknown>[]) || []];
    list.push(emptyItem);
    Object.assign(newDetails, { [section]: list });
    updateCV(header, newDetails);
  };

  const removeListItem = (section: keyof typeof details, index: number) => {
    const newDetails = { ...details };
    const list = [...((newDetails[section] as unknown) as Record<string, unknown>[])];
    list.splice(index, 1);
    Object.assign(newDetails, { [section]: list });
    updateCV(header, newDetails);
  };

  const handleSocialMediaChange = (index: number, field: string, value: string) => {
    const newHeader = { ...header };
    const list = [...(newHeader.social_media || [])];
    list[index] = { ...list[index], [field]: value };
    newHeader.social_media = list;
    updateCV(newHeader, details);
  };

  const addSocialMedia = () => {
    const newHeader = { ...header };
    const list = [...(newHeader.social_media || [])];
    list.push({ platform: '', url: '' });
    newHeader.social_media = list;
    updateCV(newHeader, details);
  };

  const removeSocialMedia = (index: number) => {
    const newHeader = { ...header };
    const list = [...(newHeader.social_media || [])];
    list.splice(index, 1);
    newHeader.social_media = list;
    updateCV(newHeader, details);
  };

  return (
    <div className="cv-editor-form">
      {/* INFORMACIÓN PERSONAL */}
      <section className="form-section">
        <h3><i className="fa fa-user"></i> Información Personal</h3>
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" name="personal_info.name" value={header.personal_info.name} onChange={handleHeaderChange} />
        </div>
        <div className="form-group">
          <label>Apellidos</label>
          <div className="input-row">
            <input type="text" name="personal_info.lastname" placeholder="Primer Apellido" value={header.personal_info.lastname} onChange={handleHeaderChange} />
            <input type="text" name="personal_info.second_lastname" placeholder="Segundo Apellido" value={header.personal_info.second_lastname} onChange={handleHeaderChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Fecha de Nacimiento</label>
          <div className="birthdate-row">
            <select 
              value={header.personal_info.birthdate?.split('-')[2] || ''}
              onChange={(e) => {
                const parts = (header.personal_info.birthdate || '').split('-');
                const day = e.target.value;
                const month = parts[1] || '';
                const year = parts[0] || '';
                const newBirthdate = year ? `${year}-${month}-${day}` : '';
                handleHeaderChange({ target: { name: 'personal_info.birthdate', value: newBirthdate } } as React.ChangeEvent<HTMLInputElement>);
              }}
            >
              <option value="">Día</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                <option key={d} value={d.toString().padStart(2, '0')}>{d}</option>
              ))}
            </select>
            <select 
              value={header.personal_info.birthdate?.split('-')[1] || ''}
              onChange={(e) => {
                const parts = (header.personal_info.birthdate || '').split('-');
                const day = parts[2] || '';
                const month = e.target.value;
                const year = parts[0] || '';
                const newBirthdate = year ? `${year}-${month}-${day}` : '';
                handleHeaderChange({ target: { name: 'personal_info.birthdate', value: newBirthdate } } as React.ChangeEvent<HTMLInputElement>);
              }}
            >
              <option value="">Mes</option>
              <option value="01">Enero</option>
              <option value="02">Febrero</option>
              <option value="03">Marzo</option>
              <option value="04">Abril</option>
              <option value="05">Mayo</option>
              <option value="06">Junio</option>
              <option value="07">Julio</option>
              <option value="08">Agosto</option>
              <option value="09">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
            <select 
              value={header.personal_info.birthdate?.split('-')[0] || ''}
              onChange={(e) => {
                const parts = (header.personal_info.birthdate || '').split('-');
                const day = parts[2] || '';
                const month = parts[1] || '';
                const year = e.target.value;
                const newBirthdate = year ? `${year}-${month}-${day}` : '';
                handleHeaderChange({ target: { name: 'personal_info.birthdate', value: newBirthdate } } as React.ChangeEvent<HTMLInputElement>);
              }}
            >
              <option value="">Año</option>
              {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="form-section">
        <h3><i className="fa fa-address-book"></i> Contacto</h3>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={header.contact_info.email[0] || ''} onChange={handleContactChange} />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input type="text" name="phone" value={header.contact_info.phone_number[0]?.number || ''} onChange={handleContactChange} />
        </div>
        <div className="form-group">
          <label>Dirección</label>
          <div className="input-row mb-2">
            <input type="text" name="street_name" placeholder="Calle" value={header.contact_info.address.street_name} onChange={handleAddressChange} />
            <input type="text" name="ext_number" placeholder="Nº Ext" value={header.contact_info.address.ext_number} onChange={handleAddressChange} />
          </div>
          <div className="input-row">
            <input type="text" name="city" placeholder="Ciudad" value={header.contact_info.address.city} onChange={handleAddressChange} />
            <input type="text" name="country" placeholder="País" value={header.contact_info.address.country} onChange={handleAddressChange} />
          </div>
        </div>
      </section>

      {/* SOBRE MÍ */}
      <section className="form-section">
        <h3><i className="fa fa-info-circle"></i> Sobre mí</h3>
        <div className="form-group">
          <label>Título Profesional</label>
          <input type="text" name="about_info.title" value={header.about_info.title} onChange={handleHeaderChange} />
        </div>
        <div className="form-group">
          <label>Resumen / Descripción</label>
          <textarea name="about_info.description" value={header.about_info.description} onChange={handleHeaderChange} rows={4} />
        </div>
      </section>

      {/* REDES SOCIALES */}
      <section className="form-section">
        <div className="section-header">
          <h3><i className="fa fa-share-alt"></i> Redes Sociales</h3>
          <button className="add-btn" onClick={addSocialMedia}><i className="fa fa-plus"></i> Añadir</button>
        </div>
        {header.social_media?.map((sm, index) => (
          <div key={index} className="list-item-container">
            <div className="form-group">
              <div className="input-row">
                <input type="text" placeholder="Plataforma (LinkedIn, GitHub...)" value={sm.platform} onChange={(e) => handleSocialMediaChange(index, 'platform', e.target.value)} />
                <input type="text" placeholder="URL" value={sm.url} onChange={(e) => handleSocialMediaChange(index, 'url', e.target.value)} />
                <button className="remove-btn" onClick={() => removeSocialMedia(index)}><i className="fa fa-trash"></i></button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* EXPERIENCIA */}
      <section className="form-section">
        <div className="section-header">
          <h3><i className="fa fa-briefcase"></i> Experiencia Laboral</h3>
          <button className="add-btn" onClick={() => addListItem('experience', { id: Date.now(), job_name: '', position_name: '', duration_start: '', duration_end: '', addr: '', pos_description: '' })}>
            <i className="fa fa-plus"></i> Añadir
          </button>
        </div>
        {details.experience?.map((exp, index) => (
          <div key={exp.id || index} className="list-item-container card">
            <div className="input-row mb-2">
              <div className="input-group">
                <label>Empresa</label>
                <input type="text" placeholder="Nombre de la empresa" value={exp.job_name} onChange={(e) => handleListChange('experience', index, 'job_name', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Cargo</label>
                <input type="text" placeholder="Puesto o cargo" value={exp.position_name} onChange={(e) => handleListChange('experience', index, 'position_name', e.target.value)} />
              </div>
            </div>
            <div className="input-row mb-2">
              <div className="input-group date-group">
                <label>Inicio</label>
                <div className="month-year-row compact">
                  <select 
                    value={exp.duration_start?.split('-')[1] || ''}
                    onChange={(e) => {
                      const parts = (exp.duration_start || '').split('-');
                      const month = e.target.value;
                      const year = parts[0] || '';
                      const newDate = year || month ? `${year}-${month}` : '';
                      handleListChange('experience', index, 'duration_start', newDate);
                    }}
                  >
                    <option value="">Mes</option>
                    {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                  <select 
                    value={exp.duration_start?.split('-')[0] || ''}
                    onChange={(e) => {
                      const parts = (exp.duration_start || '').split('-');
                      const month = parts[1] || '';
                      const year = e.target.value;
                      const newDate = year || month ? `${year}-${month}` : '';
                      handleListChange('experience', index, 'duration_start', newDate);
                    }}
                  >
                    <option value="">Año</option>
                    {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="input-group date-group">
                <label>Fin</label>
                <div className="month-year-row compact">
                  <select 
                    value={exp.duration_end?.split('-')[1] || ''}
                    onChange={(e) => {
                      const parts = (exp.duration_end || '').split('-');
                      const month = e.target.value;
                      const year = parts[0] || '';
                      const newDate = year || month ? `${year}-${month}` : '';
                      handleListChange('experience', index, 'duration_end', newDate);
                    }}
                  >
                    <option value="">Mes</option>
                    {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                  <select 
                    value={exp.duration_end?.split('-')[0] || ''}
                    onChange={(e) => {
                      const parts = (exp.duration_end || '').split('-');
                      const month = parts[1] || '';
                      const year = e.target.value;
                      const newDate = year || month ? `${year}-${month}` : '';
                      handleListChange('experience', index, 'duration_end', newDate);
                    }}
                  >
                    <option value="">Año</option>
                    {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>Ubicación</label>
                <input type="text" placeholder="Ciudad, País" value={exp.addr} onChange={(e) => handleListChange('experience', index, 'addr', e.target.value)} />
              </div>
            </div>
            <div className="input-group">
              <label>Descripción</label>
              <textarea placeholder="Describe tus responsabilidades y logros" value={exp.pos_description} onChange={(e) => handleListChange('experience', index, 'pos_description', e.target.value)} rows={3} />
            </div>
            <div className="input-row-remove">
              <button className="remove-btn-inline" onClick={() => removeListItem('experience', index)}><i className="fa fa-trash"></i> Eliminar</button>
            </div>
          </div>
        ))}
      </section>

      {/* EDUCACIÓN */}
      <section className="form-section">
        <div className="section-header">
          <h3><i className="fa fa-graduation-cap"></i> Educación</h3>
          <button className="add-btn" onClick={() => addListItem('education', { institute_name: '', grade_name: '', duration_start: '', duration_end: '', addr: '', pos_description: '' })}>
            <i className="fa fa-plus"></i> Añadir
          </button>
        </div>
        {details.education?.map((edu, index) => (
          <div key={index} className="list-item-container card">
            <div className="input-row mb-2">
              <div className="input-group">
                <label>Institución</label>
                <input type="text" placeholder="Nombre de la institución" value={edu.institute_name} onChange={(e) => handleListChange('education', index, 'institute_name', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Título</label>
                <input type="text" placeholder="Título obtenido" value={edu.grade_name} onChange={(e) => handleListChange('education', index, 'grade_name', e.target.value)} />
              </div>
            </div>
            <div className="input-row mb-2">
              <div className="input-group date-group">
                <label>Inicio</label>
                <div className="month-year-row compact">
                  <select 
                    value={edu.duration_start?.split('-')[1] || ''}
                    onChange={(e) => {
                      const parts = (edu.duration_start || '').split('-');
                      const month = e.target.value;
                      const year = parts[0] || '';
                      const newDate = year || month ? `${year}-${month}` : '';
                      handleListChange('education', index, 'duration_start', newDate);
                    }}
                  >
                    <option value="">Mes</option>
                    {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                  <select 
                    value={edu.duration_start?.split('-')[0] || ''}
                    onChange={(e) => {
                      const parts = (edu.duration_start || '').split('-');
                      const month = parts[1] || '';
                      const year = e.target.value;
                      const newDate = year || month ? `${year}-${month}` : '';
                      handleListChange('education', index, 'duration_start', newDate);
                    }}
                  >
                    <option value="">Año</option>
                    {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="input-group date-group">
                <label>Fin</label>
                <div className="month-year-row compact">
                  <select 
                    value={edu.duration_end?.split('-')[1] || ''}
                    onChange={(e) => {
                      const parts = (edu.duration_end || '').split('-');
                      const month = e.target.value;
                      const year = parts[0] || '';
                      const newDate = year || month ? `${year}-${month}` : '';
                      handleListChange('education', index, 'duration_end', newDate);
                    }}
                  >
                    <option value="">Mes</option>
                    {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                  <select 
                    value={edu.duration_end?.split('-')[0] || ''}
                    onChange={(e) => {
                      const parts = (edu.duration_end || '').split('-');
                      const month = parts[1] || '';
                      const year = e.target.value;
                      const newDate = year || month ? `${year}-${month}` : '';
                      handleListChange('education', index, 'duration_end', newDate);
                    }}
                  >
                    <option value="">Año</option>
                    {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>Ubicación</label>
                <input type="text" placeholder="Ciudad, País" value={edu.addr} onChange={(e) => handleListChange('education', index, 'addr', e.target.value)} />
              </div>
            </div>
            <div className="input-group">
              <label>Detalles</label>
              <textarea placeholder="Detalles adicionales, logros, promedio..." value={edu.pos_description} onChange={(e) => handleListChange('education', index, 'pos_description', e.target.value)} rows={2} />
            </div>
            <div className="input-row-remove">
              <button className="remove-btn-inline" onClick={() => removeListItem('education', index)}><i className="fa fa-trash"></i> Eliminar</button>
            </div>
          </div>
        ))}
      </section>

      {/* HABILIDADES */}
      <section className="form-section">
        <div className="section-header">
          <h3><i className="fa fa-gears"></i> Habilidades</h3>
          <button className="add-btn" onClick={() => addListItem('abilities', { id: Date.now(), name: '', level: 5 })}>
            <i className="fa fa-plus"></i> Añadir
          </button>
        </div>
        <div className="skills-grid">
          {details.abilities?.map((skill, index) => (
            <div key={skill.id || index} className="skill-item">
              <div className="input-group">
                <label>Habilidad</label>
                <input type="text" placeholder="Nombre de la habilidad" value={skill.name} onChange={(e) => handleListChange('abilities', index, 'name', e.target.value)} />
              </div>
              <div className="level-container">
                <label>Nivel</label>
                <input type="range" min="1" max="10" value={skill.level} onChange={(e) => handleListChange('abilities', index, 'level', parseInt(e.target.value))} />
                <span>{skill.level}</span>
              </div>
              <button className="remove-btn-inline" onClick={() => removeListItem('abilities', index)}><i className="fa fa-trash"></i></button>
            </div>
          ))}
        </div>
      </section>

      {/* IDIOMAS */}
      <section className="form-section">
        <div className="section-header">
          <h3><i className="fa fa-language"></i> Idiomas</h3>
          <button className="add-btn" onClick={() => addListItem('languages', { id: Date.now(), name: '', level: 'Nativo' })}>
            <i className="fa fa-plus"></i> Añadir
          </button>
        </div>
        {details.languages?.map((lang, index) => (
          <div key={lang.id || index} className="list-item-container">
            <div className="input-row">
              <div className="input-group">
                <label>Idioma</label>
                <input type="text" placeholder="Nombre del idioma" value={lang.name} onChange={(e) => handleListChange('languages', index, 'name', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Nivel</label>
                <select value={lang.level} onChange={(e) => handleListChange('languages', index, 'level', e.target.value)}>
                  <option value="Nativo">Nativo</option>
                  <option value="C2 - Maestría">C2 - Maestría</option>
                  <option value="C1 - Avanzado">C1 - Avanzado</option>
                  <option value="B2 - Intermedio alto">B2 - Intermedio alto</option>
                  <option value="B1 - Intermedio">B1 - Intermedio</option>
                  <option value="A2 - Elemental">A2 - Elemental</option>
                  <option value="A1 - Básico">A1 - Básico</option>
                </select>
              </div>
            </div>
            <div className="input-row-remove">
              <button className="remove-btn-inline" onClick={() => removeListItem('languages', index)}><i className="fa fa-trash"></i> Eliminar</button>
            </div>
          </div>
        ))}
      </section>

      {/* PROYECTOS */}
      <section className="form-section">
        <div className="section-header">
          <h3><i className="fa fa-code"></i> Proyectos</h3>
          <button className="add-btn" onClick={() => addListItem('projects', { id: Date.now(), name: '', pos_description: '' })}>
            <i className="fa fa-plus"></i> Añadir
          </button>
        </div>
        {details.projects?.map((proj, index) => (
          <div key={proj.id || index} className="list-item-container card">
            <div className="input-group mb-2">
              <label>Nombre del Proyecto</label>
              <input type="text" placeholder="Título o nombre del proyecto" value={proj.name} onChange={(e) => handleListChange('projects', index, 'name', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Descripción</label>
              <textarea placeholder="Describe el proyecto, tecnologías usadas, objetivos..." value={proj.pos_description} onChange={(e) => handleListChange('projects', index, 'pos_description', e.target.value)} rows={2} />
            </div>
            <div className="input-row-remove">
              <button className="remove-btn-inline" onClick={() => removeListItem('projects', index)}><i className="fa fa-trash"></i> Eliminar</button>
            </div>
          </div>
        ))}
      </section>

      {/* INTERESES */}
      <section className="form-section">
        <h3><i className="fa fa-heart"></i> Intereses</h3>
        <div className="interests-input-container">
          <input 
            type="text" 
            placeholder="Escribe un interés y presiona Enter" 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const target = e.target as HTMLInputElement;
                const value = target.value.trim();
                if (value && !details.interests?.includes(value)) {
                  updateCV(header, { ...details, interests: [...(details.interests || []), value] });
                  target.value = '';
                }
              }
            }}
          />
          <button 
            className="add-btn" 
            onClick={(e) => {
              const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
              const value = input.value.trim();
              if (value && !details.interests?.includes(value)) {
                updateCV(header, { ...details, interests: [...(details.interests || []), value] });
                input.value = '';
              }
            }}
          >
            <i className="fa fa-plus"></i> Agregar
          </button>
        </div>
        <div className="interests-pills">
          {(details.interests || []).map((interest, index) => (
            <span key={index} className="interest-pill">
              {interest}
              <button 
                onClick={() => {
                  const newInterests = [...(details.interests || [])];
                  newInterests.splice(index, 1);
                  updateCV(header, { ...details, interests: newInterests });
                }}
              >
                <i className="fa fa-times"></i>
              </button>
            </span>
          ))}
        </div>
      </section>
      
      {/* IMAGEN DE PERFIL */}
      <section className="form-section">
        <h3><i className="fa fa-image"></i> Imagen de Perfil</h3>
        <div className="form-group">
          <label>URL de la imagen</label>
          <input type="text" value={details.picture || ''} onChange={(e) => updateCV(header, { ...details, picture: e.target.value })} placeholder="https://ejemplo.com/foto.jpg" />
        </div>
      </section>
    </div>
  );
};

export default CVEditorForm;
