using Microsoft.Data.Sqlite;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace semqlindex
{
    public partial class Form1 : Form
    {
        static ReadDB read = new ReadDB();
        static DataView dv;

        public Form1()
        {
            InitializeComponent();
            //default filter
            textBox1.Lines = new string[] { "Subject = 'pspp'" };
        }

        private void button1_Click(object sender, EventArgs e)
        {

        }

        private void button2_Click(object sender, EventArgs e)
        {
            using (var connection = new SqliteConnection("Data Source=moviedata.db"))
            {
                connection.Open();
                var query = "SELECT * FROM person";

                var command = connection.CreateCommand();
                //command.CommandText = @"SELECT * FROM movie";
                command.CommandText = query;

                using (var r = command.ExecuteReader())
                {

                    while (r.Read())
                    {
                        //Console.WriteLine("");
                        for (var i = 0; i < r.FieldCount; i++)
                        {
                            if (r.IsDBNull(i)) continue;
                            var data = r.GetString(i);
                            var col = r.GetName(i);
                            Console.WriteLine(col + ": " + data);
                        }
                    }
                }
            }
        }
        private void button3_Click(object sender, EventArgs e)
        {
            read.ReadSQLite();
        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {
            if (dv == null || textBox1.Lines.Count() == 0) return;
            dv.RowFilter = textBox1.Lines[0];
            dv.Sort = "Start";
        }
    }
}
