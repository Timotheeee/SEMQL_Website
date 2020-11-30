using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.OleDb;
using System.Data;
using Microsoft.Data.Sqlite;
using static System.Text.RegularExpressions.Regex;

namespace semqlindex
{
    class ReadDB
    {
        Dictionary<String, HashSet<string>> dic = new Dictionary<string, HashSet<string>>();


        public void ReadSQLite()
        {
            //command.Parameters.AddWithValue("$id", id);
            string result = "";
            

            try
            {
                using (var connection = new SqliteConnection("Data Source=moviedata.db"))
                {
                    connection.Open();

                    var command = connection.CreateCommand();
                    //command.CommandText = @"SELECT * FROM movie";
                    command.CommandText = @"SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY 1";


                    using (var reader = command.ExecuteReader())
                    {

                        while (reader.Read())
                        {
                            var tbl = reader.GetString(0);
                            var command2 = connection.CreateCommand();
                            if (tbl.Contains("soda_idx") || tbl.Contains("sqlite")) continue;
                            var query = "SELECT * FROM " + tbl;
                            Console.WriteLine(query);
                            command2.CommandText = query;
                            using (var r = command2.ExecuteReader())
                            {

                                while (r.Read())
                                {
                                    for (var i = 0; i < r.FieldCount; i++)
                                    {
                                        if (r.IsDBNull(i)) continue;
                                        var data = r.GetString(i);//ex: mark tallman
                                        var col = r.GetName(i);//ex: name

                                        add(col, tbl, col);
                                        add(data, tbl, col);
                                        foreach (var word in data.Split(' '))
                                        {
                                            //Console.WriteLine(word + ": " + tbl + "." + col);
                                            add(word, tbl, col);

                                        }

                                    }


                                }
                            }
                            //break;
                        }
                    }
                }


            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                Console.WriteLine(e.StackTrace);
            }

            System.IO.File.WriteAllText("index.txt", "");
            Console.WriteLine(dic.Count);
            int j = 0;
            foreach (var item in dic.ToArray())
            {
                result += item.Key + ":" + string.Join(",", item.Value.ToArray()) + "\n";
                j++;
                if (j > 1000)
                {
                    System.IO.File.AppendAllText("index.txt", result.ToLower());
                    j = 0;
                    result = "";
                }
                //Console.WriteLine(j);
            }


            foreach (var item in dic.ToArray())
            {

                if (item.Key.ToLower() == "productions")
                {
                    Console.WriteLine(item.Key + ":" + string.Join(",", item.Value.ToArray()) + "\n");
                }


            }


            System.IO.File.AppendAllText("index.txt", result.ToLower());
            //Console.WriteLine(result);
            //System.IO.File.WriteAllText("index.txt",result);
        }

        void add(string word, string tbl, string col)
        {
            word = Replace(word.Trim(), "[^A-Z0-9a-z ]","").ToLower();

            //.Replace("[^A-Z0-9a-z]", "")
            //if (word == "productions")
            //{
            //    Console.WriteLine("adding productions: " + dic.ContainsKey(word) + " " + tbl + "." + col);
            //}

            if (dic.ContainsKey(word))
            {
                dic[word].Add(tbl + "." + col);
            }
            else
            {

                dic.Add(word, new HashSet<string>());
                dic[word].Add(tbl + "." + col);
            }
        }
    }
}