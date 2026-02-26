import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setCVData } from '../../../store/cvSlice';
import { PhoneType } from '../../../interfaces/contact_info';
import './cv_editor_form.scss';

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

  const handleListChange = (section: keyof typeof details, index: number, field: string, value: any) => {
    const newDetails = { ...details };
    const list = [...(newDetails[section] as any[])];
    list[index] = { ...list[index], [field]: value };
    (newDetails as any)[section] = list;
    updateCV(header, newDetails);
  };

  const addListItem = (section: keyof typeof details, emptyItem: any) => {
    const newDetails = { ...details };
    const list = [...(newDetails[section] as any[]) || []];
    list.push(emptyItem);
    (newDetails as any)[section] = list;
    updateCV(header, newDetails);
  };

  const removeListItem = (section: keyof typeof details, index: number) => {
    const newDetails = { ...details };
    const list = [...(newDetails[section] as any[])];
    list.splice(index, 1);
    (newDetails as any)[section] = list;
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

  const handleInterestsChange = (value: string) => {
    const newDetails = { ...details, interests: value.split(',').map(s => s.trim()) };
    updateCV(header, newDetails);
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
          <input type="text" name="personal_info.birthdate" placeholder="YYYY-MM-DD" value={header.personal_info.birthdate} onChange={handleHeaderChange} />
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
              <input type="text" placeholder="Empresa" value={exp.job_name} onChange={(e) => handleListChange('experience', index, 'job_name', e.target.value)} />
              <input type="text" placeholder="Cargo" value={exp.position_name} onChange={(e) => handleListChange('experience', index, 'position_name', e.target.value)} />
            </div>
            <div className="input-row mb-2">
              <input type="text" placeholder="Inicio" value={exp.duration_start} onChange={(e) => handleListChange('experience', index, 'duration_start', e.target.value)} />
              <input type="text" placeholder="Fin" value={exp.duration_end} onChange={(e) => handleListChange('experience', index, 'duration_end', e.target.value)} />
              <input type="text" placeholder="Ubicación" value={exp.addr} onChange={(e) => handleListChange('experience', index, 'addr', e.target.value)} />
            </div>
            <textarea placeholder="Descripción de responsabilidades" value={exp.pos_description} onChange={(e) => handleListChange('experience', index, 'pos_description', e.target.value)} rows={3} />
            <button className="remove-btn-absolute" onClick={() => removeListItem('experience', index)}><i className="fa fa-trash"></i></button>
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
              <input type="text" placeholder="Institución" value={edu.institute_name} onChange={(e) => handleListChange('education', index, 'institute_name', e.target.value)} />
              <input type="text" placeholder="Título" value={edu.grade_name} onChange={(e) => handleListChange('education', index, 'grade_name', e.target.value)} />
            </div>
            <div className="input-row mb-2">
              <input type="text" placeholder="Inicio" value={edu.duration_start} onChange={(e) => handleListChange('education', index, 'duration_start', e.target.value)} />
              <input type="text" placeholder="Fin" value={edu.duration_end} onChange={(e) => handleListChange('education', index, 'duration_end', e.target.value)} />
              <input type="text" placeholder="Ubicación" value={edu.addr} onChange={(e) => handleListChange('education', index, 'addr', e.target.value)} />
            </div>
            <textarea placeholder="Detalles adicionales" value={edu.pos_description} onChange={(e) => handleListChange('education', index, 'pos_description', e.target.value)} rows={2} />
            <button className="remove-btn-absolute" onClick={() => removeListItem('education', index)}><i className="fa fa-trash"></i></button>
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
              <input type="text" placeholder="Habilidad" value={skill.name} onChange={(e) => handleListChange('abilities', index, 'name', e.target.value)} />
              <div className="level-container">
                <input type="range" min="1" max="10" value={skill.level} onChange={(e) => handleListChange('abilities', index, 'level', parseInt(e.target.value))} />
                <span>{skill.level}</span>
              </div>
              <button className="remove-btn-small" onClick={() => removeListItem('abilities', index)}><i className="fa fa-times"></i></button>
            </div>
          ))}
        </div>
      </section>

      {/* IDIOMAS */}
      <section className="form-section">
        <div className="section-header">
          <h3><i className="fa fa-language"></i> Idiomas</h3>
          <button className="add-btn" onClick={() => addListItem('languages', { id: Date.now(), name: '', level: '' })}>
            <i className="fa fa-plus"></i> Añadir
          </button>
        </div>
        {details.languages?.map((lang, index) => (
          <div key={lang.id || index} className="list-item-container">
            <div className="input-row">
              <input type="text" placeholder="Idioma" value={lang.name} onChange={(e) => handleListChange('languages', index, 'name', e.target.value)} />
              <input type="text" placeholder="Nivel (B2, Nativo...)" value={lang.level} onChange={(e) => handleListChange('languages', index, 'level', e.target.value)} />
              <button className="remove-btn" onClick={() => removeListItem('languages', index)}><i className="fa fa-trash"></i></button>
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
            <input type="text" className="mb-2" placeholder="Nombre del Proyecto" value={proj.name} onChange={(e) => handleListChange('projects', index, 'name', e.target.value)} />
            <textarea placeholder="Descripción del proyecto" value={proj.pos_description} onChange={(e) => handleListChange('projects', index, 'pos_description', e.target.value)} rows={2} />
            <button className="remove-btn-absolute" onClick={() => removeListItem('projects', index)}><i className="fa fa-trash"></i></button>
          </div>
        ))}
      </section>

      {/* INTERESES */}
      <section className="form-section">
        <h3><i className="fa fa-heart"></i> Intereses</h3>
        <div className="form-group">
          <label>Intereses (separados por comas)</label>
          <input type="text" value={details.interests?.join(', ') || ''} onChange={(e) => handleInterestsChange(e.target.value)} placeholder="Música, Deporte, Lectura..." />
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
